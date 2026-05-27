"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EscrowService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infra/prisma/prisma.service");
const env_1 = require("../../config/env");
const wallet_service_1 = require("../wallet/wallet.service");
const notifications_service_1 = require("../notifications/notifications.service");
/**
 * Job escrow. Employer funds are HELD on acceptance and released to the
 * worker (minus platform fee, deducted from payout) on completion. Passive
 * employer inaction auto-releases to the worker; only an active dispute can
 * freeze funds (for admin resolution — Phase 4).
 */
let EscrowService = class EscrowService {
    prisma;
    wallet;
    notifications;
    logger = new common_1.Logger('EscrowService');
    constructor(prisma, wallet, notifications) {
        this.prisma = prisma;
        this.wallet = wallet;
        this.notifications = notifications;
    }
    feeFor(amountSatang) {
        return Math.round((amountSatang * env_1.env.wallet.platformFeeBps) / 10000);
    }
    /** Fire-and-forget — a notification failure must never roll back a payment. */
    async notify(input) {
        try {
            await this.notifications.create(input);
        }
        catch { /* swallow */ }
    }
    formatThb(satang) {
        return (satang / 100).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    // ── Hold (called from ApplicationsService.updateStatus → accepted) ───────
    /**
     * Debits the employer and creates a HELD escrow, atomically, inside the
     * caller's transaction. Throws INSUFFICIENT_FUNDS (rolls the accept back)
     * if the employer can't cover the job amount.
     */
    async holdWithinTx(tx, params) {
        const existing = await tx.escrow.findUnique({
            where: { applicationId: params.applicationId },
        });
        if (existing)
            return existing; // already escrowed (idempotent re-accept)
        const amount = Math.round(params.payAmountThb * 100);
        if (amount <= 0)
            throw new common_1.BadRequestException('Invalid job pay amount');
        const feeAmount = this.feeFor(amount);
        const wallet = await tx.wallet.findUnique({ where: { userId: params.employerId } });
        if (!wallet)
            throw new common_1.BadRequestException('INSUFFICIENT_FUNDS');
        const escrow = await tx.escrow.create({
            data: {
                jobId: params.jobId,
                applicationId: params.applicationId,
                employerId: params.employerId,
                workerId: params.workerId,
                amount,
                feeAmount,
                status: 'HELD',
            },
        });
        // Throws INSUFFICIENT_FUNDS if it would overdraw → whole accept rolls back.
        await this.wallet.postEntry(tx, wallet.id, wallet_service_1.WALLET_TX.ESCROW_HOLD, -amount, {
            refType: 'escrow',
            refId: escrow.id,
            description: `Escrow hold for job #${params.jobId}`,
        });
        return escrow;
    }
    // ── Internal release / refund (run inside a transaction) ────────────────
    async releaseWithinTx(tx, escrowId) {
        const escrow = await tx.escrow.findUniqueOrThrow({ where: { id: escrowId } });
        if (escrow.status === 'RELEASED')
            return escrow;
        if (escrow.status === 'REFUNDED') {
            throw new common_1.ConflictException(`Cannot release escrow in status ${escrow.status}`);
        }
        // DISPUTED is allowed here only via resolveDispute; public callers
        // (confirm/auto-release) gate status before reaching this.
        const workerWallet = await tx.wallet.findUniqueOrThrow({
            where: { userId: escrow.workerId },
        });
        // Gross in, fee out → worker nets amount - fee. Transparent in the ledger.
        await this.wallet.postEntry(tx, workerWallet.id, wallet_service_1.WALLET_TX.ESCROW_RELEASE, escrow.amount, {
            refType: 'escrow',
            refId: escrow.id,
            description: `Payment for job #${escrow.jobId}`,
        });
        if (escrow.feeAmount > 0) {
            await this.wallet.postEntry(tx, workerWallet.id, wallet_service_1.WALLET_TX.FEE, -escrow.feeAmount, {
                refType: 'escrow',
                refId: escrow.id,
                description: `Platform fee (${env_1.env.wallet.platformFeeBps / 100}%)`,
            });
        }
        const updated = await tx.escrow.update({
            where: { id: escrow.id },
            data: { status: 'RELEASED', releasedAt: new Date() },
        });
        await tx.job.update({ where: { id: escrow.jobId }, data: { status: 'completed' } });
        return updated;
    }
    async refundWithinTx(tx, escrowId) {
        const escrow = await tx.escrow.findUniqueOrThrow({ where: { id: escrowId } });
        if (escrow.status === 'REFUNDED')
            return escrow;
        if (escrow.status === 'RELEASED') {
            throw new common_1.ConflictException(`Cannot refund escrow in status ${escrow.status}`);
        }
        // HELD (cancel) or DISPUTED (resolveDispute); public callers gate status.
        const employerWallet = await tx.wallet.findUniqueOrThrow({
            where: { userId: escrow.employerId },
        });
        await this.wallet.postEntry(tx, employerWallet.id, wallet_service_1.WALLET_TX.ESCROW_REFUND, escrow.amount, { refType: 'escrow', refId: escrow.id, description: `Refund for job #${escrow.jobId}` });
        const updated = await tx.escrow.update({
            where: { id: escrow.id },
            data: { status: 'REFUNDED' },
        });
        await tx.job.update({ where: { id: escrow.jobId }, data: { status: 'open' } });
        return updated;
    }
    async getOwned(escrowId, userId, side) {
        const escrow = await this.prisma.escrow.findUnique({ where: { id: escrowId } });
        if (!escrow)
            throw new common_1.NotFoundException('Escrow not found');
        const ownerId = side === 'employer' ? escrow.employerId : escrow.workerId;
        if (ownerId !== userId) {
            throw new common_1.ForbiddenException(`Only the ${side} can perform this action`);
        }
        return escrow;
    }
    // ── Public actions ──────────────────────────────────────────────────────
    /** Worker: "งานเสร็จแล้ว" — starts the auto-release timer. */
    async markWorkDone(escrowId, workerId, proofPhotos) {
        const escrow = await this.getOwned(escrowId, workerId, 'worker');
        if (escrow.status !== 'HELD') {
            throw new common_1.ConflictException(`Cannot mark done in status ${escrow.status}`);
        }
        if (!proofPhotos || proofPhotos.length === 0) {
            throw new common_1.BadRequestException('PROOF_REQUIRED');
        }
        const now = new Date();
        const autoReleaseAt = new Date(now.getTime() + env_1.env.wallet.escrowAutoReleaseDays * 24 * 60 * 60 * 1000);
        return this.prisma.escrow.update({
            where: { id: escrowId },
            data: {
                status: 'PENDING_CONFIRMATION',
                workerMarkedDoneAt: now,
                autoReleaseAt,
                proofPhotos: JSON.stringify(proofPhotos),
            },
        });
    }
    /** Employer: confirm completion → immediate release to the worker. */
    async confirmAndRelease(escrowId, employerId) {
        const escrow = await this.getOwned(escrowId, employerId, 'employer');
        if (escrow.status !== 'PENDING_CONFIRMATION' && escrow.status !== 'HELD') {
            throw new common_1.ConflictException(`Cannot confirm in status ${escrow.status}`);
        }
        const updated = await this.prisma.$transaction((tx) => this.releaseWithinTx(tx, escrowId));
        const job = await this.prisma.job.findUnique({
            where: { id: escrow.jobId },
            select: { title: true },
        });
        const net = escrow.amount - escrow.feeAmount;
        await this.notify({
            userId: escrow.workerId,
            type: 'payment_released',
            title: 'ได้รับเงินค่าจ้างแล้ว',
            body: `นายจ้างยืนยันการจ่ายเงินสำหรับงาน "${job?.title ?? ''}" จำนวน ${this.formatThb(net)} บาท เข้ากระเป๋าเงินของคุณแล้ว`,
            link: '/wallet',
            refType: 'escrow',
            refId: escrow.id,
        });
        return updated;
    }
    /** Employer: dispute → freezes auto-release, escalates to admin (Phase 4). */
    async dispute(escrowId, employerId, reason) {
        const escrow = await this.getOwned(escrowId, employerId, 'employer');
        if (escrow.status !== 'PENDING_CONFIRMATION' && escrow.status !== 'HELD') {
            throw new common_1.ConflictException(`Cannot dispute in status ${escrow.status}`);
        }
        return this.prisma.escrow.update({
            where: { id: escrowId },
            data: { status: 'DISPUTED', disputedAt: new Date(), disputeReason: reason },
        });
    }
    /**
     * Admin resolution of a DISPUTED escrow → pay the worker or refund the
     * employer. Closes the loop so disputed funds can't stay frozen forever.
     */
    async resolveDispute(escrowId, outcome) {
        const escrow = await this.prisma.escrow.findUnique({ where: { id: escrowId } });
        if (!escrow)
            throw new common_1.NotFoundException('Escrow not found');
        if (escrow.status !== 'DISPUTED') {
            throw new common_1.ConflictException(`Escrow is not disputed (status ${escrow.status})`);
        }
        return this.prisma.$transaction((tx) => outcome === 'release'
            ? this.releaseWithinTx(tx, escrowId)
            : this.refundWithinTx(tx, escrowId));
    }
    /** Employer: cancel before any work is declared → refund. */
    async cancelAndRefund(escrowId, employerId) {
        const escrow = await this.getOwned(escrowId, employerId, 'employer');
        if (escrow.status !== 'HELD') {
            throw new common_1.ConflictException(`Can only cancel a HELD escrow (current: ${escrow.status})`);
        }
        const updated = await this.prisma.$transaction((tx) => this.refundWithinTx(tx, escrowId));
        const job = await this.prisma.job.findUnique({
            where: { id: escrow.jobId },
            select: { title: true },
        });
        await this.notify({
            userId: escrow.workerId,
            type: 'job_cancelled',
            title: 'นายจ้างยกเลิกงาน',
            body: `งาน "${job?.title ?? ''}" ถูกยกเลิกโดยนายจ้าง คุณสามารถสมัครงานอื่นได้ตามปกติ`,
            link: '/workboard',
            refType: 'escrow',
            refId: escrow.id,
        });
        return updated;
    }
    /**
     * Auto-release every PENDING_CONFIRMATION escrow past its deadline that
     * isn't disputed. Runs lazily on list + via the sweep endpoint. A real
     * scheduler should call the sweep in production (SQLite has no cron).
     */
    async releaseDue() {
        const due = await this.prisma.escrow.findMany({
            where: {
                status: 'PENDING_CONFIRMATION',
                disputedAt: null,
                autoReleaseAt: { lte: new Date() },
            },
            select: {
                id: true,
                workerId: true,
                amount: true,
                feeAmount: true,
                job: { select: { title: true } },
            },
        });
        let released = 0;
        for (const e of due) {
            try {
                await this.prisma.$transaction((tx) => this.releaseWithinTx(tx, e.id));
                released++;
                const net = e.amount - e.feeAmount;
                await this.notify({
                    userId: e.workerId,
                    type: 'payment_auto_released',
                    title: 'รับเงินอัตโนมัติแล้ว',
                    body: `เนื่องจากนายจ้างไม่ได้ยืนยันภายในระยะเวลาที่กำหนด ระบบจึงโอนเงินค่างาน "${e.job?.title ?? ''}" จำนวน ${this.formatThb(net)} บาท เข้ากระเป๋าเงินของคุณอัตโนมัติ`,
                    link: '/wallet',
                    refType: 'escrow',
                    refId: e.id,
                });
            }
            catch (err) {
                this.logger.error(`auto-release escrow #${e.id} failed: ${err.message}`);
            }
        }
        if (released)
            this.logger.log(`auto-released ${released} escrow(s)`);
        return released;
    }
    /** Both parties need a wallet before a hold/release can post entries. */
    async ensureWallets(employerId, workerId) {
        await this.wallet.getOrCreate(employerId);
        await this.wallet.getOrCreate(workerId);
    }
    /**
     * Internal (no ownership check — ApplicationsService is the authority):
     * refund a still-HELD escrow when an accepted application is reverted.
     */
    async refundByApplication(applicationId) {
        const escrow = await this.prisma.escrow.findUnique({ where: { applicationId } });
        if (escrow && escrow.status === 'HELD') {
            await this.prisma.$transaction((tx) => this.refundWithinTx(tx, escrow.id));
        }
    }
    async listMine(userId) {
        await this.releaseDue(); // opportunistic; cheap at current scale
        return this.prisma.escrow.findMany({
            where: { OR: [{ employerId: userId }, { workerId: userId }] },
            include: {
                job: { select: { id: true, title: true, payAmount: true } },
                worker: { select: { id: true, firstName: true, lastName: true } },
                employer: { select: { id: true, firstName: true, lastName: true } },
            },
            orderBy: { id: 'desc' },
        });
    }
};
exports.EscrowService = EscrowService;
exports.EscrowService = EscrowService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        wallet_service_1.WalletService,
        notifications_service_1.NotificationsService])
], EscrowService);
