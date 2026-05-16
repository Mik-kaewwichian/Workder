import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { CreateWorkerPostDto, UpdateWorkerPostDto } from './workerposts.dto';

@Injectable()
export class WorkerPostsService {
    constructor(private prisma: PrismaService) {}

    async create(dto: CreateWorkerPostDto) {
        return this.prisma.workerPost.create({
            data: {
                workerId: dto.workerId,
                headline: dto.headline,
                skills: dto.skills,
                description: dto.description,
                expectedPay: dto.expectedPay,
            },
            include: {
                worker: { select: { id: true, firstName: true, lastName: true, phone: true } },
            },
        });
    }

    async findAll() {
        return this.prisma.workerPost.findMany({
            where: { available: true },
            include: {
                worker: { select: { id: true, firstName: true, lastName: true, phone: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findByWorker(workerId: number) {
        return this.prisma.workerPost.findMany({
            where: { workerId },
            include: {
                worker: { select: { id: true, firstName: true, lastName: true, phone: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async update(id: number, dto: UpdateWorkerPostDto) {
        const post = await this.prisma.workerPost.findUnique({ where: { id } });
        if (!post) throw new NotFoundException('Worker post not found');
        return this.prisma.workerPost.update({ where: { id }, data: dto });
    }

    async remove(id: number) {
        const post = await this.prisma.workerPost.findUnique({ where: { id } });
        if (!post) throw new NotFoundException('Worker post not found');
        return this.prisma.workerPost.delete({ where: { id } });
    }
}
