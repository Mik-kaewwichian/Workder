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
exports.ApplicationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infra/prisma/prisma.service");
let ApplicationsService = class ApplicationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async apply(dto) {
        const job = await this.prisma.job.findUnique({ where: { id: dto.jobId } });
        if (!job)
            throw new common_1.NotFoundException('Job not found');
        if (job.status !== 'open')
            throw new common_1.ConflictException('Job is no longer open');
        const existing = await this.prisma.application.findUnique({
            where: { jobId_workerId: { jobId: dto.jobId, workerId: dto.workerId } },
        });
        if (existing)
            throw new common_1.ConflictException('Already applied to this job');
        return this.prisma.application.create({
            data: {
                jobId: dto.jobId,
                workerId: dto.workerId,
                message: dto.message,
            },
            include: {
                job: true,
                worker: { select: { id: true, firstName: true, lastName: true, email: true } },
            },
        });
    }
    async getApplicationsByJob(jobId) {
        return this.prisma.application.findMany({
            where: { jobId },
            include: {
                worker: {
                    select: { id: true, firstName: true, lastName: true, email: true, phone: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getApplicationsByWorker(workerId) {
        return this.prisma.application.findMany({
            where: { workerId },
            include: {
                job: {
                    include: {
                        postedBy: {
                            select: { id: true, firstName: true, lastName: true, email: true },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateStatus(id, dto) {
        const application = await this.prisma.application.findUnique({ where: { id } });
        if (!application)
            throw new common_1.NotFoundException('Application not found');
        return this.prisma.application.update({
            where: { id },
            data: { status: dto.status },
        });
    }
};
exports.ApplicationsService = ApplicationsService;
exports.ApplicationsService = ApplicationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ApplicationsService);
