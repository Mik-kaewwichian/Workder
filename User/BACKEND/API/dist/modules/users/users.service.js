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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcryptjs_1 = require("bcryptjs");
const prisma_service_1 = require("../../infra/prisma/prisma.service");
const stripPasswordHash = (user) => {
    const { passwordHash, ...safeUser } = user;
    return safeUser;
};
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async user(userWhereUniqueInput) {
        const user = await this.prisma.user.findUnique({
            where: userWhereUniqueInput,
        });
        return user ? stripPasswordHash(user) : null;
    }
    async users(params) {
        const { skip, take, cursor, where, orderBy } = params;
        const users = await this.prisma.user.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
        return users.map(stripPasswordHash);
    }
    async findByEmail(email) {
        return this.prisma.user.findFirst({
            where: { email: email.trim().toLowerCase() },
        });
    }
    toPublicUser(user) {
        return stripPasswordHash(user);
    }
    async getPublicProfile(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                applicationsSubmitted: {
                    where: { status: 'accepted' },
                    select: { id: true },
                },
                workerPosts: {
                    where: { available: true },
                    select: { id: true, headline: true, skills: true, description: true, expectedPay: true },
                    orderBy: { createdAt: 'desc' },
                },
                userReviewsReceived: {
                    include: {
                        author: { select: { id: true, firstName: true, lastName: true, avatar: true } },
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!user)
            return null;
        const reviews = user.userReviewsReceived;
        const avgRating = reviews.length
            ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
            : null;
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            province: user.province,
            district: user.district,
            occupation: user.occupation,
            education: user.education,
            certificates: user.certificates,
            profileCompleted: user.profileCompleted,
            createdAt: user.createdAt,
            avatar: user.avatar,
            banner: user.banner,
            completedJobsCount: user.applicationsSubmitted.length,
            avgRating,
            reviewCount: reviews.length,
            reviews,
            workerPosts: user.workerPosts,
        };
    }
    async createUser(data) {
        const normalizedEmail = data.email.trim().toLowerCase();
        const existingUser = await this.findByEmail(normalizedEmail);
        if (existingUser) {
            throw new common_1.ConflictException('Email already in use');
        }
        const user = await this.prisma.user.create({
            data: {
                email: normalizedEmail,
                role: data.role,
                firstName: data.firstName,
                lastName: data.lastName,
                birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
                passwordHash: await (0, bcryptjs_1.hash)(data.password, 12),
            },
        });
        return stripPasswordHash(user);
    }
    async updateUser(params) {
        const { where, data } = params;
        const existing = await this.prisma.user.findUnique({ where });
        if (!existing)
            throw new common_1.NotFoundException('User not found');
        const user = await this.prisma.user.update({
            data: {
                email: data.email?.trim().toLowerCase(),
                role: data.role,
                firstName: data.firstName,
                lastName: data.lastName,
                birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
                passwordHash: data.password ? await (0, bcryptjs_1.hash)(data.password, 12) : undefined,
                profileCompleted: data.profileCompleted,
                phone: data.phone,
                occupation: data.occupation,
                education: data.education,
                certificates: data.certificates,
                income: data.income,
                address: data.address,
                province: data.province,
                district: data.district,
                subDistrict: data.subDistrict,
                zipCode: data.zipCode,
                idCard: data.idCard,
                idCardFront: data.idCardFront,
                idCardBack: data.idCardBack,
                idCardSelfie: data.idCardSelfie,
                faceScan: data.faceScan,
                avatar: data.avatar,
                banner: data.banner,
            },
            where,
        });
        return stripPasswordHash(user);
    }
    async deleteUser(where) {
        const user = await this.prisma.user.delete({
            where,
        });
        return stripPasswordHash(user);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
