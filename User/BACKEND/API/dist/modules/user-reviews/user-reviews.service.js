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
exports.UserReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infra/prisma/prisma.service");
let UserReviewsService = class UserReviewsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        if (dto.authorId === dto.targetId) {
            throw new common_1.ForbiddenException('Cannot review yourself');
        }
        const existing = await this.prisma.userReview.findUnique({
            where: { authorId_targetId: { authorId: dto.authorId, targetId: dto.targetId } },
        });
        if (existing)
            throw new common_1.ConflictException('You have already reviewed this user');
        return this.prisma.userReview.create({
            data: { authorId: dto.authorId, targetId: dto.targetId, rating: dto.rating, comment: dto.comment },
            include: {
                author: { select: { id: true, firstName: true, lastName: true, avatar: true } },
            },
        });
    }
    async getByTarget(targetId) {
        return this.prisma.userReview.findMany({
            where: { targetId },
            include: {
                author: { select: { id: true, firstName: true, lastName: true, avatar: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async remove(id, requesterId) {
        const review = await this.prisma.userReview.findUnique({ where: { id } });
        if (!review)
            throw new common_1.NotFoundException('Review not found');
        if (review.authorId !== requesterId)
            throw new common_1.ForbiddenException('Not your review');
        return this.prisma.userReview.delete({ where: { id } });
    }
};
exports.UserReviewsService = UserReviewsService;
exports.UserReviewsService = UserReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserReviewsService);
