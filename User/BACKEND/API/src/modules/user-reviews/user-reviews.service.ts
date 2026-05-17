import { ConflictException, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { CreateUserReviewDto } from './user-reviews.dto';

@Injectable()
export class UserReviewsService {
    constructor(private prisma: PrismaService) {}

    async create(dto: CreateUserReviewDto) {
        if (dto.authorId === dto.targetId) {
            throw new ForbiddenException('Cannot review yourself');
        }

        const existing = await this.prisma.userReview.findUnique({
            where: { authorId_targetId: { authorId: dto.authorId, targetId: dto.targetId } },
        });
        if (existing) throw new ConflictException('You have already reviewed this user');

        return this.prisma.userReview.create({
            data: { authorId: dto.authorId, targetId: dto.targetId, rating: dto.rating, comment: dto.comment },
            include: {
                author: { select: { id: true, firstName: true, lastName: true, avatar: true } },
            },
        });
    }

    async getByTarget(targetId: number) {
        return this.prisma.userReview.findMany({
            where: { targetId },
            include: {
                author: { select: { id: true, firstName: true, lastName: true, avatar: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async remove(id: number, requesterId: number) {
        const review = await this.prisma.userReview.findUnique({ where: { id } });
        if (!review) throw new NotFoundException('Review not found');
        if (review.authorId !== requesterId) throw new ForbiddenException('Not your review');
        return this.prisma.userReview.delete({ where: { id } });
    }
}
