import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { CreateApplicationDto, UpdateApplicationStatusDto } from './applications.dto';

@Injectable()
export class ApplicationsService {
    constructor(private prisma: PrismaService) {}

    async apply(dto: CreateApplicationDto) {
        const job = await this.prisma.job.findUnique({ where: { id: dto.jobId } });
        if (!job) throw new NotFoundException('Job not found');
        if (job.status !== 'open') throw new ConflictException('Job is no longer open');
        if (job.postedById === dto.workerId) {
            throw new ForbiddenException('You cannot apply to your own job');
        }

        const existing = await this.prisma.application.findUnique({
            where: { jobId_workerId: { jobId: dto.jobId, workerId: dto.workerId } },
        });
        if (existing) throw new ConflictException('Already applied to this job');

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

    async getById(id: number) {
        const application = await this.prisma.application.findUnique({
            where: { id },
            include: {
                job: {
                    select: { id: true, title: true, postedById: true, status: true },
                },
                worker: {
                    select: { id: true, firstName: true, lastName: true },
                },
            },
        });
        if (!application) throw new NotFoundException('Application not found');
        return application;
    }

    async getApplicationsByJob(jobId: number) {
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

    async getApplicationsByWorker(workerId: number) {
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

    async updateStatus(id: number, dto: UpdateApplicationStatusDto) {
        const application = await this.prisma.application.findUnique({ where: { id } });
        if (!application) throw new NotFoundException('Application not found');

        return this.prisma.application.update({
            where: { id },
            data: { status: dto.status },
        });
    }
}
