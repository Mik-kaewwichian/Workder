import 'dotenv/config';

function str(name: string, fallback = ''): string {
    const raw = process.env[name];
    return raw === undefined || raw.trim() === '' ? fallback : raw.trim();
}

function int(name: string, fallback: number): number {
    const raw = process.env[name];
    if (raw === undefined || raw.trim() === '') return fallback;
    const n = Number(raw);
    return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

/**
 * Typed, validated view of environment configuration. Existing modules still
 * read process.env directly; wallet/payment code should import `env` instead.
 * All money values are integer satang (1 THB = 100 satang).
 */
export const env = {
    port: int('PORT', 4001),
    jwtSecret: str('JWT_SECRET', 'workder-dev-secret'),
    jwtExpiresIn: str('JWT_EXPIRES_IN', '7d'),

    payment: {
        provider: (str('PAYMENT_PROVIDER', 'mock') === 'omise' ? 'omise' : 'mock') as
            | 'omise'
            | 'mock',
        omise: {
            publicKey: str('OMISE_PUBLIC_KEY'),
            secretKey: str('OMISE_SECRET_KEY'),
            webhookSecret: str('OMISE_WEBHOOK_SECRET'),
        },
    },

    wallet: {
        // Platform commission in basis points (1000 = 10%), deducted from the
        // worker payout on escrow release.
        platformFeeBps: int('PLATFORM_FEE_BPS', 1000),
        withdrawalMinAmount: int('WITHDRAWAL_MIN_AMOUNT', 10000), // 100 THB
        withdrawalFee: int('WITHDRAWAL_FEE', 0),
        // Days after the worker marks work done before escrow auto-releases
        // to the worker if the employer neither confirms nor disputes.
        escrowAutoReleaseDays: int('ESCROW_AUTO_RELEASE_DAYS', 3),
    },
} as const;

export type AppEnv = typeof env;
