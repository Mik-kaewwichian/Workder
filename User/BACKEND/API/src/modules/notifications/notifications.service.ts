import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';

export type CreateNotificationInput = {
    userId: number;
    type: string;
    title: string;
    body: string;
    link?: string;
    refType?: string;
    refId?: number;
};

@Injectable()
export class NotificationsService {
    constructor(private prisma: PrismaService) {}

    create(input: CreateNotificationInput) {
        return this.prisma.notification.create({
            data: {
                userId: input.userId,
                type: input.type,
                title: input.title,
                body: input.body,
                link: input.link,
                refType: input.refType,
                refId: input.refId,
            },
        });
    }

    listForUser(userId: number) {
        return this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
    }

    async unreadCount(userId: number) {
        const count = await this.prisma.notification.count({
            where: { userId, readAt: null },
        });
        return { count };
    }

    async markRead(userId: number, id: number) {
        const n = await this.prisma.notification.findUnique({ where: { id } });
        if (!n || n.userId !== userId) throw new NotFoundException();
        if (n.readAt) return n;
        return this.prisma.notification.update({
            where: { id },
            data: { readAt: new Date() },
        });
    }

    async markAllRead(userId: number) {
        const result = await this.prisma.notification.updateMany({
            where: { userId, readAt: null },
            data: { readAt: new Date() },
        });
        return { updated: result.count };
    }
}
