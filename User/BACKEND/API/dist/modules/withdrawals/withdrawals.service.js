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
exports.WithdrawalsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infra/prisma/prisma.service");
const env_1 = require("../../config/env");
const wallet_service_1 = require("../wallet/wallet.service");
/** Bank-account CRUD + withdrawal requests. Payout itself is manual
 *  (approve/reject endpoint); real Omise Transfers is deferred (keyless). */
let WithdrawalsService = class WithdrawalsService {
    prisma;
    wallet;
    logger = new common_1.Logger('WithdrawalsService');
    constructor(prisma, wallet) {
        this.prisma = prisma;
        this.wallet = wallet;
    }
    mask(accountNumber) {
        return accountNumber.length <= 4
            ? accountNumber
            : `${'•'.repeat(accountNumber.length - 4)}${accountNumber.slice(-4)}`;
    }
    // ── Bank accounts ───────────────────────────────────────────────────────
    async listBankAccounts(userId) {
        const rows = await this.prisma.bankAccount.findMany({
            where: { userId },
            orderBy: [{ isDefault: 'desc' }, { id: 'desc' }],
        });
        return rows.map((b) => ({ ...b, accountNumber: this.mask(b.accountNumber) }));
    }
    async addBankAccount(userId, dto) {
        const count = await this.prisma.bankAccount.count({ where: { userId } });
        const makeDefault = dto.isDefault || count === 0;
        return this.prisma.$transaction(async (tx) => {
            if (makeDefault) {
                await tx.bankAccount.updateMany({
                    where: { userId },
                    data: { isDefault: false },
                });
            }
            const created = await tx.bankAccount.create({
                data: {
                    userId,
                    bankCode: dto.bankCode,
                    bankName: dto.bankName,
                    accountNumber: dto.accountNumber,
                    accountName: dto.accountName,
                    isDefault: makeDefault,
                },
            });
            return { ...created, accountNumber: this.mask(created.accountNumber) };
        });
    }
    async deleteBankAccount(userId, id) {
        const bank = await this.prisma.bankAccount.findUnique({ where: { id } });
        if (!bank || bank.userId !== userId) {
            throw new common_1.NotFoundException('Bank account not found');
        }
        await this.prisma.bankAccount.delete({ where: { id } });
        return { deleted: true };
    }
    // ── Withdrawals ─────────────────────────────────────────────────────────
    async requestWithdrawal(userId, dto) {
        const amount = Math.round(dto.amount * 100);
        const fee = env_1.env.wallet.withdrawalFee;
        if (amount < env_1.env.wallet.withdrawalMinAmount) {
            throw new common_1.BadRequestException('AMOUNT_BELOW_MINIMUM');
        }
        const bank = await this.prisma.bankAccount.findUnique({
            where: { id: dto.bankAccountId },
        });
        if (!bank || bank.userId !== userId) {
            throw new common_1.NotFoundException('Bank account not found');
        }
        await this.wallet.getOrCreate(userId);
        return this.prisma.$transaction(async (tx) => {
            const w = await tx.wallet.findUniqueOrThrow({ where: { userId } });
            const withdrawal = await tx.withdrawal.create({
                data: {
                    userId,
                    bankAccountId: bank.id,
                    amount,
                    feeAmount: fee,
                    bankName: bank.bankName,
                    accountNumber: bank.accountNumber,
                    accountName: bank.accountName,
                    status: 'REQUESTED',
                },
            });
            // Debit amount + fee now; refunded if rejected. Throws
            // INSUFFICIENT_FUNDS (rolls back) if the balance can't cover it.
            await this.wallet.postEntry(tx, w.id, wallet_service_1.WALLET_TX.PAYOUT, -(amount + fee), {
                refType: 'withdrawal',
                refId: withdrawal.id,
                description: `Withdrawal to ${bank.bankName} ${this.mask(bank.accountNumber)}`,
            });
            return {
                ...withdrawal,
                accountNumber: this.mask(withdrawal.accountNumber),
                amountThb: (0, wallet_service_1.toThb)(amount),
            };
        });
    }
    async listWithdrawals(userId) {
        const rows = await this.prisma.withdrawal.findMany({
            where: { userId },
            orderBy: { id: 'desc' },
        });
        return rows.map((w) => ({
            ...w,
            accountNumber: this.mask(w.accountNumber),
            amountThb: (0, wallet_service_1.toThb)(w.amount),
        }));
    }
    // ── Processing (admin/cron — TODO Phase 4: restrict to admin) ───────────
    async approve(id) {
        const w = await this.prisma.withdrawal.findUnique({ where: { id } });
        if (!w)
            throw new common_1.NotFoundException('Withdrawal not found');
        if (w.status !== 'REQUESTED') {
            throw new common_1.ConflictException(`Cannot approve in status ${w.status}`);
        }
        // Deferred real payout: mark PAID. A live Omise Transfers integration
        // would create a recipient transfer here and store providerTransferId.
        return this.prisma.withdrawal.update({
            where: { id },
            data: { status: 'PAID', processedAt: new Date() },
        });
    }
    async reject(id, reason) {
        const w = await this.prisma.withdrawal.findUnique({ where: { id } });
        if (!w)
            throw new common_1.NotFoundException('Withdrawal not found');
        if (w.status !== 'REQUESTED') {
            throw new common_1.ConflictException(`Cannot reject in status ${w.status}`);
        }
        return this.prisma.$transaction(async (tx) => {
            const wallet = await tx.wallet.findUniqueOrThrow({ where: { userId: w.userId } });
            await this.wallet.postEntry(tx, wallet.id, wallet_service_1.WALLET_TX.ADJUSTMENT, w.amount + w.feeAmount, {
                refType: 'withdrawal',
                refId: w.id,
                description: `Withdrawal rejected refund${reason ? ` (${reason})` : ''}`,
            });
            return tx.withdrawal.update({
                where: { id },
                data: { status: 'REJECTED', processedAt: new Date() },
            });
        });
    }
    /** Guard helper for actions that must be the row owner. */
    assertOwner(rowUserId, userId) {
        if (rowUserId !== userId)
            throw new common_1.ForbiddenException('Not your withdrawal');
    }
};
exports.WithdrawalsService = WithdrawalsService;
exports.WithdrawalsService = WithdrawalsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        wallet_service_1.WalletService])
], WithdrawalsService);
