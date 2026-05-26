"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockProvider = void 0;
const common_1 = require("@nestjs/common");
/**
 * Dev provider — no external calls. Creates a fake "pending" charge and
 * remembers its amount so a dev endpoint can later mark it successful
 * (see PaymentsController POST /payments/mock/complete/:topUpId).
 */
let MockProvider = class MockProvider {
    name = 'mock';
    logger = new common_1.Logger('MockProvider');
    charges = new Map();
    async createPromptPayCharge(input) {
        const providerChargeId = `mock_chrg_${input.topUpId}_${Date.now()}`;
        this.charges.set(providerChargeId, { status: 'pending', amountSatang: input.amountSatang });
        this.logger.debug(`created mock charge ${providerChargeId} for ${input.amountSatang} satang`);
        return {
            providerChargeId,
            // A data-URI placeholder so the frontend has something to render.
            qrPayload: `mock://promptpay/${providerChargeId}`,
            status: 'pending',
        };
    }
    async getCharge(providerChargeId) {
        const c = this.charges.get(providerChargeId);
        if (!c) {
            return { providerChargeId, status: 'failed', amountSatang: 0 };
        }
        return { providerChargeId, status: c.status, amountSatang: c.amountSatang };
    }
    /** Dev-only: simulate the customer paying the PromptPay QR. */
    markPaid(providerChargeId) {
        const c = this.charges.get(providerChargeId);
        if (!c)
            return false;
        c.status = 'successful';
        return true;
    }
};
exports.MockProvider = MockProvider;
exports.MockProvider = MockProvider = __decorate([
    (0, common_1.Injectable)()
], MockProvider);
