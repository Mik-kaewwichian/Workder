"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModule = void 0;
const common_1 = require("@nestjs/common");
const env_1 = require("../../config/env");
const mock_provider_1 = require("./mock.provider");
const omise_provider_1 = require("./omise.provider");
const payment_types_1 = require("./payment.types");
/**
 * Binds PAYMENT_PROVIDER to Omise or Mock based on PAYMENT_PROVIDER env.
 * MockProvider is also exported concretely so the dev "mark paid" endpoint
 * can drive it. Global so wallet/payments can inject the token directly.
 */
let PaymentModule = class PaymentModule {
};
exports.PaymentModule = PaymentModule;
exports.PaymentModule = PaymentModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            mock_provider_1.MockProvider,
            omise_provider_1.OmiseProvider,
            {
                provide: payment_types_1.PAYMENT_PROVIDER,
                inject: [mock_provider_1.MockProvider, omise_provider_1.OmiseProvider],
                useFactory: (mock, omise) => env_1.env.payment.provider === 'omise' ? omise : mock,
            },
        ],
        exports: [payment_types_1.PAYMENT_PROVIDER, mock_provider_1.MockProvider],
    })
], PaymentModule);
