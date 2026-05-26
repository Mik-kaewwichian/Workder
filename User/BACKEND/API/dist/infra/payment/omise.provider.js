"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmiseProvider = void 0;
const common_1 = require("@nestjs/common");
const env_1 = require("../../config/env");
const OMISE_API = 'https://api.omise.co';
/**
 * Live PromptPay via Omise (https://docs.omise.co). Uses the REST API
 * directly (Basic auth, no SDK dependency). Public key creates the
 * PromptPay source; secret key creates/reads the charge.
 */
let OmiseProvider = class OmiseProvider {
    name = 'omise';
    logger = new common_1.Logger('OmiseProvider');
    authHeader(key) {
        if (!key) {
            throw new common_1.ServiceUnavailableException('Omise keys are not configured');
        }
        return `Basic ${Buffer.from(`${key}:`).toString('base64')}`;
    }
    async call(method, path, key, body) {
        const res = await fetch(`${OMISE_API}${path}`, {
            method,
            headers: {
                Authorization: this.authHeader(key),
                ...(body ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}),
            },
            body: body ? new URLSearchParams(body).toString() : undefined,
        });
        const json = (await res.json());
        if (!res.ok || json.object === 'error') {
            this.logger.error(`Omise ${method} ${path} failed: ${json.message ?? res.status}`);
            throw new common_1.ServiceUnavailableException('Payment provider error');
        }
        return json;
    }
    normalize(c) {
        if (c.status === 'successful')
            return 'successful';
        if (c.status === 'pending')
            return 'pending';
        if (c.status === 'expired')
            return 'expired';
        return 'failed';
    }
    async createPromptPayCharge(input) {
        const source = await this.call('POST', '/sources', env_1.env.payment.omise.publicKey, {
            type: 'promptpay',
            amount: String(input.amountSatang),
            currency: 'thb',
        });
        const charge = await this.call('POST', '/charges', env_1.env.payment.omise.secretKey, {
            amount: String(input.amountSatang),
            currency: 'thb',
            source: source.id,
            'metadata[topUpId]': String(input.topUpId),
        });
        const qr = charge.source?.scannable_code?.image?.download_uri;
        if (!qr) {
            throw new common_1.ServiceUnavailableException('Omise did not return a PromptPay QR');
        }
        return {
            providerChargeId: charge.id,
            qrPayload: qr,
            status: this.normalize(charge),
        };
    }
    async getCharge(providerChargeId) {
        const charge = await this.call('GET', `/charges/${providerChargeId}`, env_1.env.payment.omise.secretKey);
        return {
            providerChargeId: charge.id,
            status: this.normalize(charge),
            amountSatang: charge.amount,
        };
    }
};
exports.OmiseProvider = OmiseProvider;
exports.OmiseProvider = OmiseProvider = __decorate([
    (0, common_1.Injectable)()
], OmiseProvider);
