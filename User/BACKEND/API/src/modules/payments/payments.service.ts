import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { MockProvider } from '../../infra/payment/mock.provider';
import { env } from '../../config/env';
import { WalletService } from '../wallet/wallet.service';

type OmiseEvent = {
    key?: string;
    data?: { id?: string; object?: string };
};

@Injectable()
export class PaymentsService {
    private readonly logger = new Logger('PaymentsService');

    constructor(
        private readonly prisma: PrismaService,
        private readonly wallet: WalletService,
        private readonly mock: MockProvider,
    ) {}

    /**
     * Omise posts charge.complete here. We never trust the body — we only
     * pull the charge id and re-verify with the provider before crediting.
     */
    async handleOmiseWebhook(event: OmiseEvent): Promise<{ received: true }> {
        const chargeId = event?.data?.id;
        if (event?.key === 'charge.complete' && chargeId) {
            try {
                const credited = await this.wallet.confirmTopUpByChargeId(chargeId);
                this.logger.log(`webhook ${chargeId}: credited=${credited}`);
            } catch (err) {
                // Swallow so Omise doesn't retry forever on our internal errors.
                this.logger.error(`webhook ${chargeId} failed: ${(err as Error).message}`);
            }
        }
        return { received: true };
    }

    /** Dev-only: simulate the customer paying a mock PromptPay QR. */
    async completeMockTopUp(topUpId: number) {
        if (env.payment.provider !== 'mock') {
            throw new BadRequestException('Mock completion is disabled (provider is not mock)');
        }
        const topUp = await this.prisma.topUp.findUnique({ where: { id: topUpId } });
        if (!topUp?.providerChargeId) {
            throw new NotFoundException('Top-up or its charge not found');
        }
        this.mock.markPaid(topUp.providerChargeId);
        const credited = await this.wallet.confirmTopUpByChargeId(topUp.providerChargeId);
        return { topUpId, credited };
    }
}
