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
exports.WithdrawalsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const withdrawals_service_1 = require("./withdrawals.service");
const withdrawals_dto_1 = require("./withdrawals.dto");
let WithdrawalsController = class WithdrawalsController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    listBanks(userId) {
        return this.svc.listBankAccounts(userId);
    }
    addBank(userId, dto) {
        return this.svc.addBankAccount(userId, dto);
    }
    deleteBank(userId, id) {
        return this.svc.deleteBankAccount(userId, id);
    }
    listWithdrawals(userId) {
        return this.svc.listWithdrawals(userId);
    }
    request(userId, dto) {
        return this.svc.requestWithdrawal(userId, dto);
    }
    /** Processing — TODO(Phase 4): restrict to admin / drive from a job. */
    approve(id) {
        return this.svc.approve(id);
    }
    reject(id, dto) {
        return this.svc.reject(id, dto.reason);
    }
};
exports.WithdrawalsController = WithdrawalsController;
__decorate([
    (0, common_1.Get)('bank-accounts'),
    __param(0, (0, current_user_decorator_1.CurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], WithdrawalsController.prototype, "listBanks", null);
__decorate([
    (0, common_1.Post)('bank-accounts'),
    __param(0, (0, current_user_decorator_1.CurrentUserId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, withdrawals_dto_1.CreateBankAccountDto]),
    __metadata("design:returntype", void 0)
], WithdrawalsController.prototype, "addBank", null);
__decorate([
    (0, common_1.Delete)('bank-accounts/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUserId)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], WithdrawalsController.prototype, "deleteBank", null);
__decorate([
    (0, common_1.Get)('withdrawals'),
    __param(0, (0, current_user_decorator_1.CurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], WithdrawalsController.prototype, "listWithdrawals", null);
__decorate([
    (0, common_1.Post)('withdrawals'),
    __param(0, (0, current_user_decorator_1.CurrentUserId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, withdrawals_dto_1.CreateWithdrawalDto]),
    __metadata("design:returntype", void 0)
], WithdrawalsController.prototype, "request", null);
__decorate([
    (0, common_1.Post)('withdrawals/:id/approve'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], WithdrawalsController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)('withdrawals/:id/reject'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, withdrawals_dto_1.RejectWithdrawalDto]),
    __metadata("design:returntype", void 0)
], WithdrawalsController.prototype, "reject", null);
exports.WithdrawalsController = WithdrawalsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('wallet'),
    __metadata("design:paramtypes", [withdrawals_service_1.WithdrawalsService])
], WithdrawalsController);
