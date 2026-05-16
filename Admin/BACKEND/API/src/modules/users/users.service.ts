import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { User, Prisma } from '@workder/admin-db';
import { CreateUserDto, UpdateUserDto } from './users.dto';

export type PublicUser = Omit<User, 'passwordHash'>;
export type UserActivityLogItem = {
    id: number;
    action: string;
    targetUserId?: number | null;
    targetEmail?: string | null;
    targetRole?: string | null;
    actorUserId?: number | null;
    actorEmail?: string | null;
    actorManagerCode?: string | null;
    createdAt: Date;
};

const stripPasswordHash = (user: User): PublicUser => {
    const { passwordHash, ...safeUser } = user;
    return safeUser;
};

type ProfileOtpState = {
    email?: string;
    phone?: string;
    emailOtp?: string;
    phoneOtp?: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    expiresAt: number;
};

const PROFILE_OTP_TTL_MS = 5 * 60 * 1000;

const createOtpCode = () => String(Math.floor(100000 + Math.random() * 900000));

const normalizePhoneForOtp = (value?: string) => {
    const trimmed = value?.trim();
    if (!trimmed) {
        return '';
    }

    const noSpaces = trimmed.replace(/[\s-]/g, '');

    if (noSpaces.startsWith('+66')) {
        return noSpaces;
    }

    if (noSpaces.startsWith('66')) {
        return `+${noSpaces}`;
    }

    if (noSpaces.startsWith('0')) {
        return `+66${noSpaces.slice(1)}`;
    }

    if (noSpaces.startsWith('+')) {
        return noSpaces;
    }

    return noSpaces;
};

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    private readonly logger = new Logger(UsersService.name);
    private profileOtpStateByUserId = new Map<number, ProfileOtpState>();

    private isOtpDevFallbackEnabled() {
        const raw = process.env.OTP_DEV_FALLBACK;
        if (typeof raw === 'string') {
            const normalized = raw.trim().toLowerCase();
            return normalized === '1' || normalized === 'true' || normalized === 'yes' || normalized === 'on';
        }

        return process.env.NODE_ENV !== 'production';
    }

    private async sendEmailOtp(email: string, otpCode: string): Promise<'sent' | 'fallback'> {
        const resendApiKey = process.env.RESEND_API_KEY?.trim();
        const otpFromEmail = process.env.OTP_FROM_EMAIL?.trim();

        if (!resendApiKey || !otpFromEmail) {
            if (this.isOtpDevFallbackEnabled()) {
                this.logger.warn(`[OTP-EMAIL-DEV][fallback] ${email} => ${otpCode}`);
                return 'fallback';
            }
            throw new InternalServerErrorException('ยังไม่ได้ตั้งค่า RESEND_API_KEY หรือ OTP_FROM_EMAIL');
        }

        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: otpFromEmail,
                to: [email],
                subject: 'WORKDER OTP Verification',
                html: `<p>รหัส OTP ของคุณคือ <b>${otpCode}</b></p><p>รหัสจะหมดอายุภายใน 5 นาที</p>`,
            }),
        });

        if (!response.ok) {
            const responseText = await response.text();
            this.logger.error(`Send email OTP failed (${response.status}): ${responseText}`);
            if (this.isOtpDevFallbackEnabled()) {
                this.logger.warn(`[OTP-EMAIL-DEV][fallback-after-fail] ${email} => ${otpCode}`);
                return 'fallback';
            }
            throw new InternalServerErrorException('ส่ง OTP ไปยังอีเมลไม่สำเร็จ');
        }

        return 'sent';
    }

    private async sendPhoneOtp(phone: string, otpCode: string): Promise<'sent' | 'fallback'> {
        const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
        const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN?.trim();
        const twilioFromNumber = process.env.TWILIO_FROM_NUMBER?.trim();

        if (!twilioAccountSid || !twilioAuthToken || !twilioFromNumber) {
            if (this.isOtpDevFallbackEnabled()) {
                this.logger.warn(`[OTP-PHONE-DEV][fallback] ${phone} => ${otpCode}`);
                return 'fallback';
            }
            throw new InternalServerErrorException('ยังไม่ได้ตั้งค่า Twilio สำหรับส่ง OTP ทางเบอร์โทร');
        }

        const authBase64 = Buffer.from(`${twilioAccountSid}:${twilioAuthToken}`).toString('base64');
        const body = new URLSearchParams({
            To: phone,
            From: twilioFromNumber,
            Body: `WORKDER OTP: ${otpCode} (หมดอายุใน 5 นาที)`,
        });

        const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${authBase64}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body,
        });

        if (!response.ok) {
            const responseText = await response.text();
            this.logger.error(`Send phone OTP failed (${response.status}): ${responseText}`);
            if (this.isOtpDevFallbackEnabled()) {
                this.logger.warn(`[OTP-PHONE-DEV][fallback-after-fail] ${phone} => ${otpCode}`);
                return 'fallback';
            }
            throw new InternalServerErrorException('ส่ง OTP ไปยังเบอร์โทรไม่สำเร็จ');
        }

        return 'sent';
    }

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

        const user = await (this.prisma.user as any).create({
            data: {
                email: normalizedEmail,
                role: data.role,
                firstName: data.firstName,
                lastName: data.lastName,
                birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
                managerCode: data.managerCode?.trim() || undefined,
                workStatus: data.workStatus?.trim() || undefined,
                phone: data.phone?.trim() || undefined,
                address: data.address?.trim() || undefined,
                province: data.province?.trim() || undefined,
                district: data.district?.trim() || undefined,
                subDistrict: data.subDistrict?.trim() || undefined,
                zipCode: data.zipCode?.trim() || undefined,
                idCardSelfie: data.idCardSelfie || undefined,
                roleRank: data.roleRank,
                passwordHash: await hash(data.password, 12),
            },
        });

        await (this.prisma as any).userActivityLog.create({
            data: {
                action: 'create',
                targetUserId: user.id,
                targetEmail: user.email,
                targetRole: user.role,
                actorManagerCode: data.managerCode?.trim() || undefined,
                actorEmail: 'manager-portal',
            },
        });

        return stripPasswordHash(user);
    }

    async updateUser(params: {
        where: Prisma.UserWhereUniqueInput;
        data: UpdateUserDto;
    }): Promise<PublicUser> {
        const { where, data } = params;

        const user = await (this.prisma.user as any).update({
            data: {
                email: data.email?.trim().toLowerCase(),
                role: data.role,
                firstName: data.firstName,
                lastName: data.lastName,
                birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
                managerCode: data.managerCode?.trim() || undefined,
                workStatus: data.workStatus?.trim() || undefined,
                phone: data.phone?.trim() || undefined,
                address: data.address?.trim() || undefined,
                province: data.province?.trim() || undefined,
                district: data.district?.trim() || undefined,
                subDistrict: data.subDistrict?.trim() || undefined,
                zipCode: data.zipCode?.trim() || undefined,
                idCardSelfie: data.idCardSelfie,
                roleRank: data.roleRank,
                passwordHash: data.password ? await hash(data.password, 12) : undefined,
                profileCompleted: data.profileCompleted,
            },
            where,
        });

        return stripPasswordHash(user);
    }

    async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<PublicUser> {
        const existingUser = await this.prisma.user.findUnique({ where });
        const user = await this.prisma.user.delete({
            where,
        });

        await (this.prisma as any).userActivityLog.create({
            data: {
                action: 'delete',
                targetUserId: existingUser?.id,
                targetEmail: existingUser?.email,
                targetRole: existingUser?.role,
                actorManagerCode: (existingUser as any)?.managerCode,
                actorEmail: 'manager-portal',
            },
        });

        return stripPasswordHash(user);
    }

    async userActivityLogs(limit = 50): Promise<UserActivityLogItem[]> {
        return (this.prisma as any).userActivityLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }

    async sendProfileOtp(userId: number, email?: string, phone?: string) {
        const normalizedEmail = email?.trim().toLowerCase();
        const normalizedPhone = normalizePhoneForOtp(phone);

        if (!normalizedEmail && !normalizedPhone) {
            throw new BadRequestException('กรุณาระบุอีเมลหรือเบอร์โทรอย่างน้อย 1 รายการเพื่อรับ OTP');
        }

        const emailOtp = normalizedEmail ? createOtpCode() : undefined;
        const phoneOtp = normalizedPhone ? createOtpCode() : undefined;

        this.profileOtpStateByUserId.set(userId, {
            email: normalizedEmail,
            phone: normalizedPhone,
            emailOtp,
            phoneOtp,
            emailVerified: !normalizedEmail,
            phoneVerified: !normalizedPhone,
            expiresAt: Date.now() + PROFILE_OTP_TTL_MS,
        });

        const [emailDelivery, phoneDelivery] = await Promise.all([
            normalizedEmail && emailOtp ? this.sendEmailOtp(normalizedEmail, emailOtp) : Promise.resolve<'sent' | 'fallback' | null>(null),
            normalizedPhone && phoneOtp ? this.sendPhoneOtp(normalizedPhone, phoneOtp) : Promise.resolve<'sent' | 'fallback' | null>(null),
        ]);

        const includeDevOtp = this.isOtpDevFallbackEnabled();

        return {
            ok: true,
            message: 'ส่ง OTP เรียบร้อย',
            sent: {
                email: Boolean(normalizedEmail),
                phone: Boolean(normalizedPhone),
            },
            delivery: {
                email: emailDelivery,
                phone: phoneDelivery,
            },
            devOtp: includeDevOtp
                ? {
                    email: emailDelivery === 'fallback' ? emailOtp : undefined,
                    phone: phoneDelivery === 'fallback' ? phoneOtp : undefined,
                }
                : undefined,
            expiresInSeconds: Math.floor(PROFILE_OTP_TTL_MS / 1000),
        };
    }

    async verifyProfileOtp(userId: number, email?: string, phone?: string, emailOtp?: string, phoneOtp?: string) {
        const current = this.profileOtpStateByUserId.get(userId);
        if (!current) {
            throw new BadRequestException('ไม่พบรายการ OTP กรุณาส่ง OTP ใหม่');
        }

        if (Date.now() > current.expiresAt) {
            this.profileOtpStateByUserId.delete(userId);
            throw new BadRequestException('OTP หมดอายุ กรุณาส่ง OTP ใหม่');
        }

        const normalizedEmail = email?.trim().toLowerCase();
        const normalizedPhone = normalizePhoneForOtp(phone);

        let didVerifyAnyChannel = false;

        if (current.email) {
            if (normalizedEmail !== current.email) {
                throw new BadRequestException('อีเมลไม่ตรงกับที่ขอ OTP');
            }
            if (emailOtp?.trim()) {
                if (current.emailOtp !== emailOtp.trim()) {
                    throw new BadRequestException('รหัส OTP อีเมลไม่ถูกต้อง');
                }
                current.emailVerified = true;
                didVerifyAnyChannel = true;
            }
        }

        if (current.phone) {
            if (normalizedPhone !== current.phone) {
                throw new BadRequestException('เบอร์โทรไม่ตรงกับที่ขอ OTP');
            }
            if (phoneOtp?.trim()) {
                if (current.phoneOtp !== phoneOtp.trim()) {
                    throw new BadRequestException('รหัส OTP เบอร์โทรไม่ถูกต้อง');
                }
                current.phoneVerified = true;
                didVerifyAnyChannel = true;
            }
        }

        if (!didVerifyAnyChannel) {
            throw new BadRequestException('กรุณากรอก OTP อย่างน้อย 1 ช่องเพื่อยืนยัน');
        }

        this.profileOtpStateByUserId.set(userId, current);

        return {
            ok: true,
            message: 'ยืนยัน OTP สำเร็จ',
            verified: {
                email: current.emailVerified,
                phone: current.phoneVerified,
            },
        };
    }

    ensureProfileOtpVerified(userId: number, email: string, phone: string) {
        const current = this.profileOtpStateByUserId.get(userId);
        if (!current) {
            throw new BadRequestException('ยังไม่ได้ยืนยัน OTP');
        }

        if (Date.now() > current.expiresAt) {
            this.profileOtpStateByUserId.delete(userId);
            throw new BadRequestException('OTP หมดอายุ กรุณาส่งใหม่');
        }

        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPhone = normalizePhoneForOtp(phone);

        if (current.email) {
            if (current.email !== normalizedEmail || !current.emailVerified) {
                throw new BadRequestException('กรุณายืนยัน OTP อีเมลก่อนบันทึกข้อมูลส่วนตัว');
            }
        }

        if (current.phone) {
            if (current.phone !== normalizedPhone || !current.phoneVerified) {
                throw new BadRequestException('กรุณายืนยัน OTP เบอร์โทรก่อนบันทึกข้อมูลส่วนตัว');
            }
        }

        this.profileOtpStateByUserId.delete(userId);
    }

    async updateProfileWithOtp(
        userId: number,
        data: {
            email?: string;
            phone?: string;
            address?: string;
            province?: string;
            district?: string;
            subDistrict?: string;
            zipCode?: string;
        },
    ): Promise<PublicUser> {
        const existingUser = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!existingUser) {
            throw new BadRequestException('ไม่พบผู้ใช้งาน');
        }

        const targetEmail = data.email?.trim().toLowerCase() ?? (existingUser.email?.trim().toLowerCase() || '');
        const targetPhone = data.phone?.trim() ?? (existingUser.phone?.trim() || '');
        const targetPhoneCanonical = normalizePhoneForOtp(targetPhone);
        const existingPhoneCanonical = normalizePhoneForOtp(existingUser.phone || '');

        const isEmailChanged = targetEmail !== (existingUser.email?.trim().toLowerCase() || '');
        const isPhoneChanged = targetPhoneCanonical !== existingPhoneCanonical;

        if (isEmailChanged || isPhoneChanged) {
            this.ensureProfileOtpVerified(userId, targetEmail, targetPhone);
        }

        const updatedUser = await (this.prisma.user as any).update({
            where: { id: userId },
            data: {
                email: targetEmail || undefined,
                phone: targetPhone || undefined,
                address: data.address?.trim() || undefined,
                province: data.province?.trim() || undefined,
                district: data.district?.trim() || undefined,
                subDistrict: data.subDistrict?.trim() || undefined,
                zipCode: data.zipCode?.trim() || undefined,
            },
        });

        return stripPasswordHash(updatedUser);
    }
}
