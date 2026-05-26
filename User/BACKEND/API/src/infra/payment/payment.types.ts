/** Payment provider abstraction. All amounts are integer satang (1 THB = 100 satang). */

export const PAYMENT_PROVIDER = Symbol('PAYMENT_PROVIDER');

export interface CreatePromptPayChargeInput {
    /** Amount to collect, in satang. */
    amountSatang: number;
    /** Our TopUp row id, passed to the provider as metadata for reconciliation. */
    topUpId: number;
}

export interface PromptPayCharge {
    /** Provider-side charge id (unique, used for idempotency). */
    providerChargeId: string;
    /** QR payload to render — an image URL or raw EMVCo string. */
    qrPayload: string;
    /** Provider status at creation time. */
    status: 'pending' | 'successful' | 'failed' | 'expired';
}

export interface NormalizedChargeEvent {
    providerChargeId: string;
    status: 'pending' | 'successful' | 'failed' | 'expired';
    /** Amount the provider actually collected, in satang. */
    amountSatang: number;
}

export interface PaymentProvider {
    readonly name: 'omise' | 'mock';

    createPromptPayCharge(input: CreatePromptPayChargeInput): Promise<PromptPayCharge>;

    /**
     * Authoritatively resolve a charge's current state straight from the
     * provider (used to verify webhooks rather than trusting their body).
     */
    getCharge(providerChargeId: string): Promise<NormalizedChargeEvent>;
}
