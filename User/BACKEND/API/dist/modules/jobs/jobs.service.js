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
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infra/prisma/prisma.service");
let JobsService = class JobsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async job(jobWhereUniqueInput) {
        return this.prisma.job.findUnique({
            where: jobWhereUniqueInput,
            include: {
                postedBy: { select: { id: true, firstName: true, lastName: true, phone: true } },
                reviews: {
                    include: { author: { select: { id: true, firstName: true, lastName: true } } },
                    orderBy: { createdAt: 'desc' },
                },
                _count: { select: { applications: true } },
            },
        });
    }
    async jobs(params) {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.job.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
            include: {
                postedBy: { select: { id: true, firstName: true, lastName: true } },
                _count: { select: { applications: true } },
            },
        });
    }
    async createJob(data) {
        return this.prisma.job.create({
            data,
        });
    }
    async updateJob(params) {
        const { where, data } = params;
        return this.prisma.job.update({
            data,
            where,
        });
    }
    async deleteJob(where) {
        // Block deletion if there is an active escrow (money is being held)
        const activeEscrow = await this.prisma.escrow.findFirst({
            where: {
                jobId: where.id,
                status: { in: ['HELD', 'PENDING_CONFIRMATION'] },
            },
        });
        if (activeEscrow) {
            throw new common_1.BadRequestException('ไม่สามารถลบงานที่มีงานกำลังดำเนินการอยู่ได้ กรุณารอให้งานเสร็จสิ้นและยืนยันการจ่ายก่อน');
        }
        return this.prisma.job.delete({ where });
    }
};
exports.JobsService = JobsService;
exports.JobsService = JobsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], JobsService);
