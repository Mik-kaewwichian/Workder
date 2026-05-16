import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { CreateReviewDto, UpdateReviewDto } from './reviews.dto';

@Injectable()
export class ReviewsService {
    constructor(private prisma: PrismaService) {}

    async create(dto: CreateReviewDto) {
        const job = await this.prisma.job.findUnique({ where: { id: dto.jobId } });
        if (!job) throw new NotFoundException('Job not found');

        const existing = await this.prisma.review.findUnique({
            where: { jobId_authorId: { jobId: dto.jobId, authorId: dto.authorId } },
        });
        if (existing) throw new ConflictException('Already reviewed this job');

        return this.prisma.review.create({
            data: { jobId: dto.jobId, authorId: dto.authorId, rating: dto.rating, comment: dto.comment },
            include: {
                author: { select: { id: true, firstName: true, lastName: true } },
            },
        });
    }

    async getByJob(jobId: number) {
        return this.prisma.review.findMany({
            where: { jobId },
            include: {
                author: { select: { id: true, firstName: true, lastName: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getByAuthor(authorId: number) {
        return this.prisma.review.findMany({
            where: { authorId },
            include: {
                job: { select: { id: true, title: true, payAmount: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async update(id: number, dto: UpdateReviewDto) {
        const review = await this.prisma.review.findUnique({ where: { id } });
        if (!review) throw new NotFoundException('Review not found');
        return this.prisma.review.update({ where: { id }, data: dto });
    }

    async remove(id: number) {
        const review = await this.prisma.review.findUnique({ where: { id } });
        if (!review) throw new NotFoundException('Review not found');
        return this.prisma.review.delete({ where: { id } });
    }
}
