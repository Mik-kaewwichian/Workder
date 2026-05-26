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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infra/prisma/prisma.service");
const mock_provider_1 = require("../../infra/payment/mock.provider");
const env_1 = require("../../config/env");
const wallet_service_1 = require("../wallet/wallet.service");
let PaymentsService = class PaymentsService {
    prisma;
    wallet;
    mock;
    logger = new common_1.Logger('PaymentsService');
    constructor(prisma, wallet, mock) {
        this.prisma = prisma;
        this.wallet = wallet;
        this.mock = mock;
    }
    /**
     * Omise posts charge.complete here. We never trust the body — we only
     * pull the charge id and re-verify with the provider before crediting.
     */
    async handleOmiseWebhook(event) {
        const chargeId = event?.data?.id;
        if (event?.key === 'charge.complete' && chargeId) {
            try {
                const credited = await this.wallet.confirmTopUpByChargeId(chargeId);
                this.logger.log(`webhook ${chargeId}: credited=${credited}`);
            }
            catch (err) {
                // Swallow so Omise doesn't retry forever on our internal errors.
                this.logger.error(`webhook ${chargeId} failed: ${err.message}`);
            }
        }
        return { received: true };
    }
    /** Dev-only: simulate the customer paying a mock PromptPay QR. */
    async completeMockTopUp(topUpId) {
        if (env_1.env.payment.provider !== 'mock') {
            throw new common_1.BadRequestException('Mock completion is disabled (provider is not mock)');
        }
        const topUp = await this.prisma.topUp.findUnique({ where: { id: topUpId } });
        if (!topUp?.providerChargeId) {
            throw new common_1.NotFoundException('Top-up or its charge not found');
        }
        this.mock.markPaid(topUp.providerChargeId);
        const credited = await this.wallet.confirmTopUpByChargeId(topUp.providerChargeId);
        return { topUpId, credited };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        wallet_service_1.WalletService,
        mock_provider_1.MockProvider])
], PaymentsService);
