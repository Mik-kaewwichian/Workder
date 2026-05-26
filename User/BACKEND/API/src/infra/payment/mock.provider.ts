import { Injectable, Logger } from '@nestjs/common';
import {
    CreatePromptPayChargeInput,
    NormalizedChargeEvent,
    PaymentProvider,
    PromptPayCharge,
} from './payment.types';

/**
 * Dev provider — no external calls. Creates a fake "pending" charge and
 * remembers its amount so a dev endpoint can later mark it successful
 * (see PaymentsController POST /payments/mock/complete/:topUpId).
 */
@Injectable()
export class MockProvider implements PaymentProvider {
    readonly name = 'mock' as const;
    private readonly logger = new Logger('MockProvider');
    private readonly charges = new Map<
        string,
        { status: NormalizedChargeEvent['status']; amountSatang: number }
    >();

    async createPromptPayCharge(input: CreatePromptPayChargeInput): Promise<PromptPayCharge> {
        const providerChargeId = `mock_chrg_${input.topUpId}_${Date.now()}`;
        this.charges.set(providerChargeId, { status: 'pending', amountSatang: input.amountSatang });
        this.logger.debug(
            `created mock charge ${providerChargeId} for ${input.amountSatang} satang`,
        );
        return {
            providerChargeId,
            // A data-URI placeholder so the frontend has something to render.
            qrPayload: `mock://promptpay/${providerChargeId}`,
            status: 'pending',
        };
    }

    async getCharge(providerChargeId: string): Promise<NormalizedChargeEvent> {
        const c = this.charges.get(providerChargeId);
        if (!c) {
            return { providerChargeId, status: 'failed', amountSatang: 0 };
        }
        return { providerChargeId, status: c.status, amountSatang: c.amountSatang };
    }

    /** Dev-only: simulate the customer paying the PromptPay QR. */
    markPaid(providerChargeId: string): boolean {
        const c = this.charges.get(providerChargeId);
        if (!c) return false;
        c.status = 'successful';
        return true;
    }
}
