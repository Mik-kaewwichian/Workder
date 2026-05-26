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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = exports.toThb = exports.toSatang = exports.WALLET_TX = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infra/prisma/prisma.service");
const payment_types_1 = require("../../infra/payment/payment.types");
/** Ledger entry types (String column — SQLite has no enums). */
exports.WALLET_TX = {
    TOPUP: 'TOPUP',
    ESCROW_HOLD: 'ESCROW_HOLD',
    ESCROW_RELEASE: 'ESCROW_RELEASE',
    ESCROW_REFUND: 'ESCROW_REFUND',
    PAYOUT: 'PAYOUT',
    FEE: 'FEE',
    ADJUSTMENT: 'ADJUSTMENT',
};
const SATANG_PER_THB = 100;
const toSatang = (thb) => Math.round(thb * SATANG_PER_THB);
exports.toSatang = toSatang;
const toThb = (satang) => satang / SATANG_PER_THB;
exports.toThb = toThb;
let WalletService = class WalletService {
    prisma;
    payment;
    logger = new common_1.Logger('WalletService');
    constructor(prisma, payment) {
        this.prisma = prisma;
        this.payment = payment;
    }
    /** Lazily creates the wallet on first access. */
    async getOrCreate(userId) {
        const existing = await this.prisma.wallet.findUnique({ where: { userId } });
        if (existing)
            return existing;
        return this.prisma.wallet.create({ data: { userId, balance: 0 } });
    }
    async getSummary(userId) {
        const wallet = await this.getOrCreate(userId);
        const recent = await this.prisma.walletTransaction.findMany({
            where: { walletId: wallet.id },
            orderBy: { id: 'desc' },
            take: 10,
        });
        return {
            balance: wallet.balance,
            balanceThb: (0, exports.toThb)(wallet.balance),
            recentTransactions: recent,
        };
    }
    async getTransactions(userId, cursor, take = 20) {
        const wallet = await this.getOrCreate(userId);
        const rows = await this.prisma.walletTransaction.findMany({
            where: { walletId: wallet.id, ...(cursor ? { id: { lt: cursor } } : {}) },
            orderBy: { id: 'desc' },
            take: take + 1,
        });
        const hasMore = rows.length > take;
        const items = hasMore ? rows.slice(0, take) : rows;
        return {
            items,
            nextCursor: hasMore ? items[items.length - 1].id : null,
        };
    }
    /**
     * Integrity check: every wallet's balance must equal the signed sum of
     * its ledger. Any drift means a bug or out-of-band write — surface it.
     */
    async reconcile() {
        const wallets = await this.prisma.wallet.findMany();
        const mismatches = [];
        for (const w of wallets) {
            const agg = await this.prisma.walletTransaction.aggregate({
                where: { walletId: w.id },
                _sum: { amount: true },
            });
            const ledgerSum = agg._sum.amount ?? 0;
            if (ledgerSum !== w.balance) {
                mismatches.push({
                    walletId: w.id,
                    userId: w.userId,
                    balance: w.balance,
                    ledgerSum,
                    drift: w.balance - ledgerSum,
                });
            }
        }
        return { ok: mismatches.length === 0, walletsChecked: wallets.length, mismatches };
    }
    /**
     * Posts a single ledger entry and moves the balance atomically. MUST run
     * inside a transaction; re-reads the wallet to keep balanceAfter correct
     * under concurrency. Rejects debits that would overdraw.
     */
    async postEntry(tx, walletId, type, amount, // signed satang: credit > 0, debit < 0
    ref = {}) {
        const wallet = await tx.wallet.findUniqueOrThrow({ where: { id: walletId } });
        const balanceAfter = wallet.balance + amount;
        if (balanceAfter < 0) {
            throw new common_1.BadRequestException('INSUFFICIENT_FUNDS');
        }
        await tx.wallet.update({ where: { id: walletId }, data: { balance: balanceAfter } });
        return tx.walletTransaction.create({
            data: {
                walletId,
                type,
                amount,
                balanceAfter,
                refType: ref.refType,
                refId: ref.refId,
                description: ref.description,
            },
        });
    }
    // ── Top-up (PromptPay) ──────────────────────────────────────────────────
    async createTopUp(userId, amountThb) {
        await this.getOrCreate(userId);
        const amountSatang = (0, exports.toSatang)(amountThb);
        const topUp = await this.prisma.topUp.create({
            data: {
                userId,
                amount: amountSatang,
                provider: this.payment.name,
                status: 'PENDING',
            },
        });
        try {
            const charge = await this.payment.createPromptPayCharge({
                amountSatang,
                topUpId: topUp.id,
            });
            const updated = await this.prisma.topUp.update({
                where: { id: topUp.id },
                data: {
                    providerChargeId: charge.providerChargeId,
                    qrPayload: charge.qrPayload,
                },
            });
            return {
                topUpId: updated.id,
                amount: updated.amount,
                amountThb: (0, exports.toThb)(updated.amount),
                qrPayload: updated.qrPayload,
                status: updated.status,
            };
        }
        catch (err) {
            await this.prisma.topUp.update({
                where: { id: topUp.id },
                data: { status: 'FAILED' },
            });
            throw err;
        }
    }
    async getTopUp(userId, topUpId) {
        const topUp = await this.prisma.topUp.findUnique({ where: { id: topUpId } });
        if (!topUp || topUp.userId !== userId) {
            throw new common_1.NotFoundException('Top-up not found');
        }
        return {
            topUpId: topUp.id,
            amount: topUp.amount,
            amountThb: (0, exports.toThb)(topUp.amount),
            qrPayload: topUp.qrPayload,
            status: topUp.status,
            paidAt: topUp.paidAt,
        };
    }
    /**
     * Idempotently settle a top-up. Verifies state with the provider (never
     * trusts a webhook body), then credits the wallet exactly once.
     * Returns true if it transitioned to PAID on this call.
     */
    async confirmTopUpByChargeId(providerChargeId) {
        const topUp = await this.prisma.topUp.findUnique({ where: { providerChargeId } });
        if (!topUp) {
            this.logger.warn(`confirmTopUp: unknown charge ${providerChargeId}`);
            return false;
        }
        if (topUp.status === 'PAID')
            return false; // already settled
        const charge = await this.payment.getCharge(providerChargeId);
        if (charge.status !== 'successful') {
            if (charge.status === 'failed' || charge.status === 'expired') {
                await this.prisma.topUp.update({
                    where: { id: topUp.id },
                    data: { status: charge.status === 'expired' ? 'EXPIRED' : 'FAILED' },
                });
            }
            return false;
        }
        return this.prisma.$transaction(async (tx) => {
            const fresh = await tx.topUp.findUniqueOrThrow({ where: { id: topUp.id } });
            if (fresh.status === 'PAID')
                return false; // raced; already credited
            const wallet = await tx.wallet.findUniqueOrThrow({
                where: { userId: fresh.userId },
            });
            await this.postEntry(tx, wallet.id, exports.WALLET_TX.TOPUP, fresh.amount, {
                refType: 'topup',
                refId: fresh.id,
                description: `Top-up via ${fresh.provider}`,
            });
            await tx.topUp.update({
                where: { id: fresh.id },
                data: { status: 'PAID', paidAt: new Date() },
            });
            return true;
        });
    }
};
exports.WalletService = WalletService;
exports.WalletService = WalletService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(payment_types_1.PAYMENT_PROVIDER)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object])
], WalletService);
