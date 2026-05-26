import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { env } from '../../config/env';
import { WALLET_TX, WalletService, toThb } from '../wallet/wallet.service';
import { CreateBankAccountDto, CreateWithdrawalDto } from './withdrawals.dto';

/** Bank-account CRUD + withdrawal requests. Payout itself is manual
 *  (approve/reject endpoint); real Omise Transfers is deferred (keyless). */
@Injectable()
export class WithdrawalsService {
    private readonly logger = new Logger('WithdrawalsService');

    constructor(
        private readonly prisma: PrismaService,
        private readonly wallet: WalletService,
    ) {}

    private mask(accountNumber: string) {
        return accountNumber.length <= 4
            ? accountNumber
            : `${'•'.repeat(accountNumber.length - 4)}${accountNumber.slice(-4)}`;
    }

    // ── Bank accounts ───────────────────────────────────────────────────────

    async listBankAccounts(userId: number) {
        const rows = await this.prisma.bankAccount.findMany({
            where: { userId },
            orderBy: [{ isDefault: 'desc' }, { id: 'desc' }],
        });
        return rows.map((b) => ({ ...b, accountNumber: this.mask(b.accountNumber) }));
    }

    async addBankAccount(userId: number, dto: CreateBankAccountDto) {
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

    async deleteBankAccount(userId: number, id: number) {
        const bank = await this.prisma.bankAccount.findUnique({ where: { id } });
        if (!bank || bank.userId !== userId) {
            throw new NotFoundException('Bank account not found');
        }
        await this.prisma.bankAccount.delete({ where: { id } });
        return { deleted: true };
    }

    // ── Withdrawals ─────────────────────────────────────────────────────────

    async requestWithdrawal(userId: number, dto: CreateWithdrawalDto) {
        const amount = Math.round(dto.amount * 100);
        const fee = env.wallet.withdrawalFee;
        if (amount < env.wallet.withdrawalMinAmount) {
            throw new BadRequestException('AMOUNT_BELOW_MINIMUM');
        }
        const bank = await this.prisma.bankAccount.findUnique({
            where: { id: dto.bankAccountId },
        });
        if (!bank || bank.userId !== userId) {
            throw new NotFoundException('Bank account not found');
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
            await this.wallet.postEntry(tx, w.id, WALLET_TX.PAYOUT, -(amount + fee), {
                refType: 'withdrawal',
                refId: withdrawal.id,
                description: `Withdrawal to ${bank.bankName} ${this.mask(bank.accountNumber)}`,
            });
            return {
                ...withdrawal,
                accountNumber: this.mask(withdrawal.accountNumber),
                amountThb: toThb(amount),
            };
        });
    }

    async listWithdrawals(userId: number) {
        const rows = await this.prisma.withdrawal.findMany({
            where: { userId },
            orderBy: { id: 'desc' },
        });
        return rows.map((w) => ({
            ...w,
            accountNumber: this.mask(w.accountNumber),
            amountThb: toThb(w.amount),
        }));
    }

    // ── Processing (admin/cron — TODO Phase 4: restrict to admin) ───────────

    async approve(id: number) {
        const w = await this.prisma.withdrawal.findUnique({ where: { id } });
        if (!w) throw new NotFoundException('Withdrawal not found');
        if (w.status !== 'REQUESTED') {
            throw new ConflictException(`Cannot approve in status ${w.status}`);
        }
        // Deferred real payout: mark PAID. A live Omise Transfers integration
        // would create a recipient transfer here and store providerTransferId.
        return this.prisma.withdrawal.update({
            where: { id },
            data: { status: 'PAID', processedAt: new Date() },
        });
    }

    async reject(id: number, reason?: string) {
        const w = await this.prisma.withdrawal.findUnique({ where: { id } });
        if (!w) throw new NotFoundException('Withdrawal not found');
        if (w.status !== 'REQUESTED') {
            throw new ConflictException(`Cannot reject in status ${w.status}`);
        }
        return this.prisma.$transaction(async (tx) => {
            const wallet = await tx.wallet.findUniqueOrThrow({ where: { userId: w.userId } });
            await this.wallet.postEntry(
                tx,
                wallet.id,
                WALLET_TX.ADJUSTMENT,
                w.amount + w.feeAmount,
                {
                    refType: 'withdrawal',
                    refId: w.id,
                    description: `Withdrawal rejected refund${reason ? ` (${reason})` : ''}`,
                },
            );
            return tx.withdrawal.update({
                where: { id },
                data: { status: 'REJECTED', processedAt: new Date() },
            });
        });
    }

    /** Guard helper for actions that must be the row owner. */
    assertOwner(rowUserId: number, userId: number) {
        if (rowUserId !== userId) throw new ForbiddenException('Not your withdrawal');
    }
}
