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
exports.UserReviewsController = void 0;
const common_1 = require("@nestjs/common");
const user_reviews_service_1 = require("./user-reviews.service");
const user_reviews_dto_1 = require("./user-reviews.dto");
let UserReviewsController = class UserReviewsController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(dto) {
        return this.service.create(dto);
    }
    byTarget(targetId) {
        return this.service.getByTarget(targetId);
    }
    remove(id, requesterId) {
        return this.service.remove(id, requesterId);
    }
};
exports.UserReviewsController = UserReviewsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_reviews_dto_1.CreateUserReviewDto]),
    __metadata("design:returntype", void 0)
], UserReviewsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('user/:targetId'),
    __param(0, (0, common_1.Param)('targetId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UserReviewsController.prototype, "byTarget", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('requesterId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], UserReviewsController.prototype, "remove", null);
exports.UserReviewsController = UserReviewsController = __decorate([
    (0, common_1.Controller)('user-reviews'),
    __metadata("design:paramtypes", [user_reviews_service_1.UserReviewsService])
], UserReviewsController);
