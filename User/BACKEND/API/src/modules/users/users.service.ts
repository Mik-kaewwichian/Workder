import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { User, Prisma } from '@workder/user-db';
import { CreateUserDto, UpdateUserDto } from './users.dto';

export type PublicUser = Omit<User, 'passwordHash'>;

type ReviewAuthor = { id: number; firstName: string | null; lastName: string | null; avatar: string | null };

export type PublicProfile = {
    id: number;
    firstName: string | null;
    lastName: string | null;
    role: string;
    province: string | null;
    district: string | null;
    occupation: string | null;
    education: string | null;
    certificates: string | null;
    profileCompleted: boolean;
    createdAt: Date;
    avatar: string | null;
    banner: string | null;
    completedJobsCount: number;
    avgRating: number | null;
    reviewCount: number;
    reviews: { id: number; rating: number; comment: string; createdAt: Date; author: ReviewAuthor }[];
    workerPosts: { id: number; headline: string; skills: string; description: string | null; expectedPay: number | null }[];
};

const stripPasswordHash = (user: User): PublicUser => {
    const { passwordHash, ...safeUser } = user;
    return safeUser;
};

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async user(
        userWhereUniqueInput: Prisma.UserWhereUniqueInput,
    ): Promise<PublicUser | null> {
        const user = await this.prisma.user.findUnique({
            where: userWhereUniqueInput,
        });

        return user ? stripPasswordHash(user) : null;
    }

    async users(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.UserWhereUniqueInput;
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
    }): Promise<PublicUser[]> {
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

    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findFirst({
            where: { email: email.trim().toLowerCase() },
        });
    }

    toPublicUser(user: User): PublicUser {
        return stripPasswordHash(user);
    }

    async getPublicProfile(id: number): Promise<PublicProfile | null> {
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

        if (!user) return null;

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

    async createUser(data: CreateUserDto): Promise<PublicUser> {
        const normalizedEmail = data.email.trim().toLowerCase();
        const existingUser = await this.findByEmail(normalizedEmail);

        if (existingUser) {
            throw new ConflictException('Email already in use');
        }

        const user = await this.prisma.user.create({
            data: {
                email: normalizedEmail,
                role: data.role,
                firstName: data.firstName,
                lastName: data.lastName,
                birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
                passwordHash: await hash(data.password, 12),
            },
        });

        return stripPasswordHash(user);
    }

    async updateUser(params: {
        where: Prisma.UserWhereUniqueInput;
        data: UpdateUserDto;
    }): Promise<PublicUser> {
        const { where, data } = params;

        const existing = await this.prisma.user.findUnique({ where });
        if (!existing) throw new NotFoundException('User not found');

        const user = await this.prisma.user.update({
            data: {
                email: data.email?.trim().toLowerCase(),
                role: data.role,
                firstName: data.firstName,
                lastName: data.lastName,
                birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
                passwordHash: data.password ? await hash(data.password, 12) : undefined,
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

    async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<PublicUser> {
        const user = await this.prisma.user.delete({
            where,
        });

        return stripPasswordHash(user);
    }
}
