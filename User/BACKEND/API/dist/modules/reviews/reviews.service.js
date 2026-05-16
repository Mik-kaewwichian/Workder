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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infra/prisma/prisma.service");
let ReviewsService = class ReviewsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const job = await this.prisma.job.findUnique({ where: { id: dto.jobId } });
        if (!job)
            throw new common_1.NotFoundException('Job not found');
        const existing = await this.prisma.review.findUnique({
            where: { jobId_authorId: { jobId: dto.jobId, authorId: dto.authorId } },
        });
        if (existing)
            throw new common_1.ConflictException('Already reviewed this job');
        return this.prisma.review.create({
            data: { jobId: dto.jobId, authorId: dto.authorId, rating: dto.rating, comment: dto.comment },
            include: {
                author: { select: { id: true, firstName: true, lastName: true } },
            },
        });
    }
    async getByJob(jobId) {
        return this.prisma.review.findMany({
            where: { jobId },
            include: {
                author: { select: { id: true, firstName: true, lastName: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getByAuthor(authorId) {
        return this.prisma.review.findMany({
            where: { authorId },
            include: {
                job: { select: { id: true, title: true, payAmount: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async update(id, dto) {
        const review = await this.prisma.review.findUnique({ where: { id } });
        if (!review)
            throw new common_1.NotFoundException('Review not found');
        return this.prisma.review.update({ where: { id }, data: dto });
    }
    async remove(id) {
        const review = await this.prisma.review.findUnique({ where: { id } });
        if (!review)
            throw new common_1.NotFoundException('Review not found');
        return this.prisma.review.delete({ where: { id } });
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsService);
