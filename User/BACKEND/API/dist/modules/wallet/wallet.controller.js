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
exports.WalletController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const wallet_service_1 = require("./wallet.service");
const wallet_dto_1 = require("./wallet.dto");
/**
 * All wallet endpoints are guarded and derive the user id from the JWT —
 * never from the request body (this is the money path).
 */
let WalletController = class WalletController {
    walletService;
    constructor(walletService) {
        this.walletService = walletService;
    }
    me(userId) {
        return this.walletService.getSummary(userId);
    }
    transactions(userId, query) {
        return this.walletService.getTransactions(userId, query.cursor, query.take ?? 20);
    }
    /** Admin: assert every wallet balance == sum(ledger). */
    reconcile(user) {
        if (user.role !== 'admin')
            throw new common_1.ForbiddenException('Admin only');
        return this.walletService.reconcile();
    }
    createTopUp(userId, dto) {
        return this.walletService.createTopUp(userId, dto.amount);
    }
    getTopUp(userId, id) {
        return this.walletService.getTopUp(userId, id);
    }
};
exports.WalletController = WalletController;
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, current_user_decorator_1.CurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], WalletController.prototype, "me", null);
__decorate([
    (0, common_1.Get)('transactions'),
    __param(0, (0, current_user_decorator_1.CurrentUserId)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, wallet_dto_1.ListTransactionsDto]),
    __metadata("design:returntype", void 0)
], WalletController.prototype, "transactions", null);
__decorate([
    (0, common_1.Get)('admin/reconcile'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WalletController.prototype, "reconcile", null);
__decorate([
    (0, common_1.Post)('topups'),
    __param(0, (0, current_user_decorator_1.CurrentUserId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, wallet_dto_1.CreateTopUpDto]),
    __metadata("design:returntype", void 0)
], WalletController.prototype, "createTopUp", null);
__decorate([
    (0, common_1.Get)('topups/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUserId)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], WalletController.prototype, "getTopUp", null);
exports.WalletController = WalletController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('wallet'),
    __metadata("design:paramtypes", [wallet_service_1.WalletService])
], WalletController);
