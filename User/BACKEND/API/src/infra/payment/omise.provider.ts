import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { env } from '../../config/env';
import {
    CreatePromptPayChargeInput,
    NormalizedChargeEvent,
    PaymentProvider,
    PromptPayCharge,
} from './payment.types';

const OMISE_API = 'https://api.omise.co';

type OmiseCharge = {
    id: string;
    status: 'pending' | 'successful' | 'failed' | 'expired' | 'reversed';
    amount: number; // satang
    source?: { scannable_code?: { image?: { download_uri?: string } } };
};

/**
 * Live PromptPay via Omise (https://docs.omise.co). Uses the REST API
 * directly (Basic auth, no SDK dependency). Public key creates the
 * PromptPay source; secret key creates/reads the charge.
 */
@Injectable()
export class OmiseProvider implements PaymentProvider {
    readonly name = 'omise' as const;
    private readonly logger = new Logger('OmiseProvider');

    private authHeader(key: string): string {
        if (!key) {
            throw new ServiceUnavailableException('Omise keys are not configured');
        }
        return `Basic ${Buffer.from(`${key}:`).toString('base64')}`;
    }

    private async call<T>(
        method: 'GET' | 'POST',
        path: string,
        key: string,
        body?: Record<string, string>,
    ): Promise<T> {
        const res = await fetch(`${OMISE_API}${path}`, {
            method,
            headers: {
                Authorization: this.authHeader(key),
                ...(body ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}),
            },
            body: body ? new URLSearchParams(body).toString() : undefined,
        });
        const json = (await res.json()) as T & { object?: string; message?: string };
        if (!res.ok || json.object === 'error') {
            this.logger.error(`Omise ${method} ${path} failed: ${json.message ?? res.status}`);
            throw new ServiceUnavailableException('Payment provider error');
        }
        return json;
    }

    private normalize(c: OmiseCharge): NormalizedChargeEvent['status'] {
        if (c.status === 'successful') return 'successful';
        if (c.status === 'pending') return 'pending';
        if (c.status === 'expired') return 'expired';
        return 'failed';
    }

    async createPromptPayCharge(input: CreatePromptPayChargeInput): Promise<PromptPayCharge> {
        const source = await this.call<{ id: string }>(
            'POST',
            '/sources',
            env.payment.omise.publicKey,
            {
                type: 'promptpay',
                amount: String(input.amountSatang),
                currency: 'thb',
            },
        );

        const charge = await this.call<OmiseCharge>(
            'POST',
            '/charges',
            env.payment.omise.secretKey,
            {
                amount: String(input.amountSatang),
                currency: 'thb',
                source: source.id,
                'metadata[topUpId]': String(input.topUpId),
            },
        );

        const qr = charge.source?.scannable_code?.image?.download_uri;
        if (!qr) {
            throw new ServiceUnavailableException('Omise did not return a PromptPay QR');
        }

        return {
            providerChargeId: charge.id,
            qrPayload: qr,
            status: this.normalize(charge),
        };
    }

    async getCharge(providerChargeId: string): Promise<NormalizedChargeEvent> {
        const charge = await this.call<OmiseCharge>(
            'GET',
            `/charges/${providerChargeId}`,
            env.payment.omise.secretKey,
        );
        return {
            providerChargeId: charge.id,
            status: this.normalize(charge),
            amountSatang: charge.amount,
        };
    }
}
