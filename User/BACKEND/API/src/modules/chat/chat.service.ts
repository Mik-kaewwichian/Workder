import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { SendMessageDto, StartConversationDto } from './chat.dto';

const userSelect = { id: true, firstName: true, lastName: true, phone: true };

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) {}

    async startConversation(dto: StartConversationDto) {
        const existing = await this.prisma.conversation.findUnique({
            where: {
                employerId_workerId: {
                    employerId: dto.employerId,
                    workerId: dto.workerId,
                },
            },
        });
        if (existing) return existing;

        return this.prisma.conversation.create({
            data: {
                jobId: dto.jobId ?? null,
                employerId: dto.employerId,
                workerId: dto.workerId,
            },
        });
    }

    async getConversations(userId: number) {
        const conversations = await this.prisma.conversation.findMany({
            where: { OR: [{ employerId: userId }, { workerId: userId }] },
            include: {
                job: { select: { id: true, title: true } },
                employer: { select: userSelect },
                worker: { select: userSelect },
                messages: { orderBy: { createdAt: 'desc' }, take: 1 },
            },
            orderBy: { updatedAt: 'desc' },
        });

        return Promise.all(
            conversations.map(async (c) => {
                const unreadCount = await this.prisma.message.count({
                    where: {
                        conversationId: c.id,
                        senderId: { not: userId },
                        readAt: null,
                    },
                });
                const other = c.employerId === userId ? c.worker : c.employer;
                return {
                    id: c.id,
                    jobId: c.jobId,
                    jobTitle: c.job?.title ?? null,
                    role: c.employerId === userId ? 'employer' : 'worker',
                    other,
                    lastMessage: c.messages[0] ?? null,
                    unreadCount,
                    updatedAt: c.updatedAt,
                };
            }),
        );
    }

    async getMessages(conversationId: number, userId: number) {
        const conversation = await this.prisma.conversation.findUnique({
            where: { id: conversationId },
            include: {
                job: { select: { id: true, title: true } },
                employer: { select: userSelect },
                worker: { select: userSelect },
            },
        });
        if (!conversation) throw new NotFoundException('Conversation not found');
        if (conversation.employerId !== userId && conversation.workerId !== userId) {
            throw new ForbiddenException('Not part of this conversation');
        }

        await this.prisma.message.updateMany({
            where: { conversationId, senderId: { not: userId }, readAt: null },
            data: { readAt: new Date() },
        });

        const messages = await this.prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: 'asc' },
        });

        const other =
            conversation.employerId === userId ? conversation.worker : conversation.employer;

        return {
            id: conversation.id,
            jobId: conversation.jobId,
            jobTitle: conversation.job?.title ?? null,
            role: conversation.employerId === userId ? 'employer' : 'worker',
            other,
            messages,
        };
    }

    async sendMessage(dto: SendMessageDto) {
        const conversation = await this.prisma.conversation.findUnique({
            where: { id: dto.conversationId },
        });
        if (!conversation) throw new NotFoundException('Conversation not found');
        if (
            conversation.employerId !== dto.senderId &&
            conversation.workerId !== dto.senderId
        ) {
            throw new ForbiddenException('Not part of this conversation');
        }

        const [message] = await this.prisma.$transaction([
            this.prisma.message.create({
                data: {
                    conversationId: dto.conversationId,
                    senderId: dto.senderId,
                    text: dto.text,
                },
            }),
            this.prisma.conversation.update({
                where: { id: dto.conversationId },
                data: { updatedAt: new Date() },
            }),
        ]);

        return message;
    }
}
