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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const env_1 = require("../../config/env");
const payments_service_1 = require("./payments.service");
let PaymentsController = class PaymentsController {
    paymentsService;
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    /**
     * Omise webhook. Public (Omise can't send a JWT). If OMISE_WEBHOOK_SECRET
     * is set we require it as a shared secret header for defence in depth;
     * actual trust comes from re-verifying the charge with the provider.
     */
    omiseWebhook(event, secret) {
        const expected = env_1.env.payment.omise.webhookSecret;
        if (expected && secret !== expected) {
            throw new common_1.UnauthorizedException('Bad webhook secret');
        }
        return this.paymentsService.handleOmiseWebhook(event);
    }
    /** Dev-only helper to simulate a paid PromptPay QR (provider=mock). */
    mockComplete(topUpId) {
        return this.paymentsService.completeMockTopUp(topUpId);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Post)('webhook/omise'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-webhook-secret')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "omiseWebhook", null);
__decorate([
    (0, common_1.Post)('mock/complete/:topUpId'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('topUpId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "mockComplete", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsController);
