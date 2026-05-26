import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@workder/user-db';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { env } from '../../config/env';
import { WALLET_TX, WalletService } from '../wallet/wallet.service';

/**
 * Job escrow. Employer funds are HELD on acceptance and released to the
 * worker (minus platform fee, deducted from payout) on completion. Passive
 * employer inaction auto-releases to the worker; only an active dispute can
 * freeze funds (for admin resolution — Phase 4).
 */
@Injectable()
export class EscrowService {
    private readonly logger = new Logger('EscrowService');

    constructor(
        private readonly prisma: PrismaService,
        private readonly wallet: WalletService,
    ) {}

    private feeFor(amountSatang: number): number {
        return Math.round((amountSatang * env.wallet.platformFeeBps) / 10000);
    }

    // ── Hold (called from ApplicationsService.updateStatus → accepted) ───────

    /**
     * Debits the employer and creates a HELD escrow, atomically, inside the
     * caller's transaction. Throws INSUFFICIENT_FUNDS (rolls the accept back)
     * if the employer can't cover the job amount.
     */
    async holdWithinTx(
        tx: Prisma.TransactionClient,
        params: {
            jobId: number;
            applicationId: number;
            employerId: number;
            workerId: number;
            payAmountThb: number;
        },
    ) {
        const existing = await tx.escrow.findUnique({
            where: { applicationId: params.applicationId },
        });
        if (existing) return existing; // already escrowed (idempotent re-accept)

        const amount = Math.round(params.payAmountThb * 100);
        if (amount <= 0) throw new BadRequestException('Invalid job pay amount');
        const feeAmount = this.feeFor(amount);

        const wallet = await tx.wallet.findUnique({ where: { userId: params.employerId } });
        if (!wallet) throw new BadRequestException('INSUFFICIENT_FUNDS');

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
        await this.wallet.postEntry(tx, wallet.id, WALLET_TX.ESCROW_HOLD, -amount, {
            refType: 'escrow',
            refId: escrow.id,
            description: `Escrow hold for job #${params.jobId}`,
        });

        return escrow;
    }

    // ── Internal release / refund (run inside a transaction) ────────────────

    private async releaseWithinTx(tx: Prisma.TransactionClient, escrowId: number) {
        const escrow = await tx.escrow.findUniqueOrThrow({ where: { id: escrowId } });
        if (escrow.status === 'RELEASED') return escrow;
        if (escrow.status === 'REFUNDED') {
            throw new ConflictException(`Cannot release escrow in status ${escrow.status}`);
        }
        // DISPUTED is allowed here only via resolveDispute; public callers
        // (confirm/auto-release) gate status before reaching this.
        const workerWallet = await tx.wallet.findUniqueOrThrow({
            where: { userId: escrow.workerId },
        });
        // Gross in, fee out → worker nets amount - fee. Transparent in the ledger.
        await this.wallet.postEntry(tx, workerWallet.id, WALLET_TX.ESCROW_RELEASE, escrow.amount, {
            refType: 'escrow',
            refId: escrow.id,
            description: `Payment for job #${escrow.jobId}`,
        });
        if (escrow.feeAmount > 0) {
            await this.wallet.postEntry(tx, workerWallet.id, WALLET_TX.FEE, -escrow.feeAmount, {
                refType: 'escrow',
                refId: escrow.id,
                description: `Platform fee (${env.wallet.platformFeeBps / 100}%)`,
            });
        }
        const updated = await tx.escrow.update({
            where: { id: escrow.id },
            data: { status: 'RELEASED', releasedAt: new Date() },
        });
        await tx.job.update({ where: { id: escrow.jobId }, data: { status: 'completed' } });
        return updated;
    }

    private async refundWithinTx(tx: Prisma.TransactionClient, escrowId: number) {
        const escrow = await tx.escrow.findUniqueOrThrow({ where: { id: escrowId } });
        if (escrow.status === 'REFUNDED') return escrow;
        if (escrow.status === 'RELEASED') {
            throw new ConflictException(`Cannot refund escrow in status ${escrow.status}`);
        }
        // HELD (cancel) or DISPUTED (resolveDispute); public callers gate status.
        const employerWallet = await tx.wallet.findUniqueOrThrow({
            where: { userId: escrow.employerId },
        });
        await this.wallet.postEntry(
            tx,
            employerWallet.id,
            WALLET_TX.ESCROW_REFUND,
            escrow.amount,
            { refType: 'escrow', refId: escrow.id, description: `Refund for job #${escrow.jobId}` },
        );
        const updated = await tx.escrow.update({
            where: { id: escrow.id },
            data: { status: 'REFUNDED' },
        });
        await tx.job.update({ where: { id: escrow.jobId }, data: { status: 'open' } });
        return updated;
    }

    private async getOwned(escrowId: number, userId: number, side: 'employer' | 'worker') {
        const escrow = await this.prisma.escrow.findUnique({ where: { id: escrowId } });
        if (!escrow) throw new NotFoundException('Escrow not found');
        const ownerId = side === 'employer' ? escrow.employerId : escrow.workerId;
        if (ownerId !== userId) {
            throw new ForbiddenException(`Only the ${side} can perform this action`);
        }
        return escrow;
    }

    // ── Public actions ──────────────────────────────────────────────────────

    /** Worker: "งานเสร็จแล้ว" — starts the auto-release timer. */
    async markWorkDone(escrowId: number, workerId: number, proofPhotos?: string[]) {
        const escrow = await this.getOwned(escrowId, workerId, 'worker');
        if (escrow.status !== 'HELD') {
            throw new ConflictException(`Cannot mark done in status ${escrow.status}`);
        }
        if (!proofPhotos || proofPhotos.length === 0) {
            throw new BadRequestException('PROOF_REQUIRED');
        }
        const now = new Date();
        const autoReleaseAt = new Date(
            now.getTime() + env.wallet.escrowAutoReleaseDays * 24 * 60 * 60 * 1000,
        );
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
    async confirmAndRelease(escrowId: number, employerId: number) {
        const escrow = await this.getOwned(escrowId, employerId, 'employer');
        if (escrow.status !== 'PENDING_CONFIRMATION' && escrow.status !== 'HELD') {
            throw new ConflictException(`Cannot confirm in status ${escrow.status}`);
        }
        return this.prisma.$transaction((tx) => this.releaseWithinTx(tx, escrowId));
    }

    /** Employer: dispute → freezes auto-release, escalates to admin (Phase 4). */
    async dispute(escrowId: number, employerId: number, reason: string) {
        const escrow = await this.getOwned(escrowId, employerId, 'employer');
        if (escrow.status !== 'PENDING_CONFIRMATION' && escrow.status !== 'HELD') {
            throw new ConflictException(`Cannot dispute in status ${escrow.status}`);
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
    async resolveDispute(escrowId: number, outcome: 'release' | 'refund') {
        const escrow = await this.prisma.escrow.findUnique({ where: { id: escrowId } });
        if (!escrow) throw new NotFoundException('Escrow not found');
        if (escrow.status !== 'DISPUTED') {
            throw new ConflictException(`Escrow is not disputed (status ${escrow.status})`);
        }
        return this.prisma.$transaction((tx) =>
            outcome === 'release'
                ? this.releaseWithinTx(tx, escrowId)
                : this.refundWithinTx(tx, escrowId),
        );
    }

    /** Employer: cancel before any work is declared → refund. */
    async cancelAndRefund(escrowId: number, employerId: number) {
        const escrow = await this.getOwned(escrowId, employerId, 'employer');
        if (escrow.status !== 'HELD') {
            throw new ConflictException(
                `Can only cancel a HELD escrow (current: ${escrow.status})`,
            );
        }
        return this.prisma.$transaction((tx) => this.refundWithinTx(tx, escrowId));
    }

    /**
     * Auto-release every PENDING_CONFIRMATION escrow past its deadline that
     * isn't disputed. Runs lazily on list + via the sweep endpoint. A real
     * scheduler should call the sweep in production (SQLite has no cron).
     */
    async releaseDue(): Promise<number> {
        const due = await this.prisma.escrow.findMany({
            where: {
                status: 'PENDING_CONFIRMATION',
                disputedAt: null,
                autoReleaseAt: { lte: new Date() },
            },
            select: { id: true },
        });
        let released = 0;
        for (const { id } of due) {
            try {
                await this.prisma.$transaction((tx) => this.releaseWithinTx(tx, id));
                released++;
            } catch (err) {
                this.logger.error(`auto-release escrow #${id} failed: ${(err as Error).message}`);
            }
        }
        if (released) this.logger.log(`auto-released ${released} escrow(s)`);
        return released;
    }

    /** Both parties need a wallet before a hold/release can post entries. */
    async ensureWallets(employerId: number, workerId: number) {
        await this.wallet.getOrCreate(employerId);
        await this.wallet.getOrCreate(workerId);
    }

    /**
     * Internal (no ownership check — ApplicationsService is the authority):
     * refund a still-HELD escrow when an accepted application is reverted.
     */
    async refundByApplication(applicationId: number) {
        const escrow = await this.prisma.escrow.findUnique({ where: { applicationId } });
        if (escrow && escrow.status === 'HELD') {
            await this.prisma.$transaction((tx) => this.refundWithinTx(tx, escrow.id));
        }
    }

    async listMine(userId: number) {
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
}
