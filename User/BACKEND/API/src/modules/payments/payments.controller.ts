import {
    Body,
    Controller,
    Headers,
    HttpCode,
    Param,
    ParseIntPipe,
    Post,
    UnauthorizedException,
} from '@nestjs/common';
import { env } from '../../config/env';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    /**
     * Omise webhook. Public (Omise can't send a JWT). If OMISE_WEBHOOK_SECRET
     * is set we require it as a shared secret header for defence in depth;
     * actual trust comes from re-verifying the charge with the provider.
     */
    @Post('webhook/omise')
    @HttpCode(200)
    omiseWebhook(
        @Body() event: unknown,
        @Headers('x-webhook-secret') secret?: string,
    ) {
        const expected = env.payment.omise.webhookSecret;
        if (expected && secret !== expected) {
            throw new UnauthorizedException('Bad webhook secret');
        }
        return this.paymentsService.handleOmiseWebhook(event as Record<string, unknown>);
    }

    /** Dev-only helper to simulate a paid PromptPay QR (provider=mock). */
    @Post('mock/complete/:topUpId')
    @HttpCode(200)
    mockComplete(@Param('topUpId', ParseIntPipe) topUpId: number) {
        return this.paymentsService.completeMockTopUp(topUpId);
    }
}
