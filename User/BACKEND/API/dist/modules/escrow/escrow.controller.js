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
exports.EscrowController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const escrow_service_1 = require("./escrow.service");
const escrow_dto_1 = require("./escrow.dto");
let EscrowController = class EscrowController {
    escrow;
    constructor(escrow) {
        this.escrow = escrow;
    }
    mine(userId) {
        return this.escrow.listMine(userId);
    }
    /** Worker marks the work finished — must include at least 1 proof photo. */
    workDone(userId, id, dto) {
        return this.escrow.markWorkDone(id, userId, dto.proofPhotos);
    }
    /** Employer confirms → release to worker. */
    confirm(userId, id) {
        return this.escrow.confirmAndRelease(id, userId);
    }
    /** Employer disputes → freeze for admin resolution. */
    dispute(userId, id, dto) {
        return this.escrow.dispute(id, userId, dto.reason);
    }
    /** Employer cancels a not-yet-started job → refund. */
    cancel(userId, id) {
        return this.escrow.cancelAndRefund(id, userId);
    }
    /** Admin: resolve a DISPUTED escrow → pay worker or refund employer. */
    resolve(user, id, dto) {
        if (user.role !== 'admin')
            throw new common_1.ForbiddenException('Admin only');
        return this.escrow.resolveDispute(id, dto.outcome);
    }
    /**
     * Sweep due auto-releases. Idempotent (only releases legitimately-due
     * escrows). TODO(Phase 4): restrict to admin / drive from a scheduler.
     */
    sweep() {
        return this.escrow.releaseDue().then((released) => ({ released }));
    }
};
exports.EscrowController = EscrowController;
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, current_user_decorator_1.CurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], EscrowController.prototype, "mine", null);
__decorate([
    (0, common_1.Post)(':id/work-done'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, current_user_decorator_1.CurrentUserId)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, escrow_dto_1.MarkWorkDoneDto]),
    __metadata("design:returntype", void 0)
], EscrowController.prototype, "workDone", null);
__decorate([
    (0, common_1.Post)(':id/confirm'),
    __param(0, (0, current_user_decorator_1.CurrentUserId)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], EscrowController.prototype, "confirm", null);
__decorate([
    (0, common_1.Post)(':id/dispute'),
    __param(0, (0, current_user_decorator_1.CurrentUserId)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, escrow_dto_1.DisputeEscrowDto]),
    __metadata("design:returntype", void 0)
], EscrowController.prototype, "dispute", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    __param(0, (0, current_user_decorator_1.CurrentUserId)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], EscrowController.prototype, "cancel", null);
__decorate([
    (0, common_1.Post)(':id/resolve'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, escrow_dto_1.ResolveDisputeDto]),
    __metadata("design:returntype", void 0)
], EscrowController.prototype, "resolve", null);
__decorate([
    (0, common_1.Post)('sweep'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EscrowController.prototype, "sweep", null);
exports.EscrowController = EscrowController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('escrow'),
    __metadata("design:paramtypes", [escrow_service_1.EscrowService])
], EscrowController);
