import { ConflictException, Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { User, Prisma } from '@workder/user-db';
import { CreateUserDto, UpdateUserDto } from './users.dto';

export type PublicUser = Omit<User, 'passwordHash'>;

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

        const user = await this.prisma.user.update({
            data: {
                email: data.email?.trim().toLowerCase(),
                role: data.role,
                firstName: data.firstName,
                lastName: data.lastName,
                birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
                passwordHash: data.password ? await hash(data.password, 12) : undefined,
                profileCompleted: data.profileCompleted,
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
