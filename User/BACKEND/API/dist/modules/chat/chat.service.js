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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infra/prisma/prisma.service");
const userSelect = { id: true, firstName: true, lastName: true, phone: true };
let ChatService = class ChatService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async startConversation(dto) {
        const existing = await this.prisma.conversation.findUnique({
            where: {
                employerId_workerId: {
                    employerId: dto.employerId,
                    workerId: dto.workerId,
                },
            },
        });
        if (existing)
            return existing;
        return this.prisma.conversation.create({
            data: {
                jobId: dto.jobId ?? null,
                employerId: dto.employerId,
                workerId: dto.workerId,
            },
        });
    }
    async getConversations(userId) {
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
        return Promise.all(conversations.map(async (c) => {
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
        }));
    }
    async getMessages(conversationId, userId) {
        const conversation = await this.prisma.conversation.findUnique({
            where: { id: conversationId },
            include: {
                job: { select: { id: true, title: true } },
                employer: { select: userSelect },
                worker: { select: userSelect },
            },
        });
        if (!conversation)
            throw new common_1.NotFoundException('Conversation not found');
        if (conversation.employerId !== userId && conversation.workerId !== userId) {
            throw new common_1.ForbiddenException('Not part of this conversation');
        }
        await this.prisma.message.updateMany({
            where: { conversationId, senderId: { not: userId }, readAt: null },
            data: { readAt: new Date() },
        });
        const messages = await this.prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: 'asc' },
        });
        const other = conversation.employerId === userId ? conversation.worker : conversation.employer;
        return {
            id: conversation.id,
            jobId: conversation.jobId,
            jobTitle: conversation.job?.title ?? null,
            role: conversation.employerId === userId ? 'employer' : 'worker',
            other,
            messages,
        };
    }
    async sendMessage(dto) {
        const conversation = await this.prisma.conversation.findUnique({
            where: { id: dto.conversationId },
        });
        if (!conversation)
            throw new common_1.NotFoundException('Conversation not found');
        if (conversation.employerId !== dto.senderId &&
            conversation.workerId !== dto.senderId) {
            throw new common_1.ForbiddenException('Not part of this conversation');
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
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChatService);
