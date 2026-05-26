import { Global, Module } from '@nestjs/common';
import { env } from '../../config/env';
import { MockProvider } from './mock.provider';
import { OmiseProvider } from './omise.provider';
import { PAYMENT_PROVIDER } from './payment.types';

/**
 * Binds PAYMENT_PROVIDER to Omise or Mock based on PAYMENT_PROVIDER env.
 * MockProvider is also exported concretely so the dev "mark paid" endpoint
 * can drive it. Global so wallet/payments can inject the token directly.
 */
@Global()
@Module({
    providers: [
        MockProvider,
        OmiseProvider,
        {
            provide: PAYMENT_PROVIDER,
            inject: [MockProvider, OmiseProvider],
            useFactory: (mock: MockProvider, omise: OmiseProvider) =>
                env.payment.provider === 'omise' ? omise : mock,
        },
    ],
    exports: [PAYMENT_PROVIDER, MockProvider],
})
export class PaymentModule {}
