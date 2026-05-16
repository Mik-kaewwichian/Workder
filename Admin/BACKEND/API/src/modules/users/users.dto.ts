import { IsBoolean, IsDateString, IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

const USER_ROLES = ['admin', 'user', 'employer'] as const;

export class CreateUserDto {
    @IsEmail()
    email!: string;

    @IsIn(USER_ROLES)
    role!: 'admin' | 'user' | 'employer';

    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsDateString()
    birthDate?: string;

    @IsOptional()
    @IsString()
    managerCode?: string;

    @IsOptional()
    @IsString()
    workStatus?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    province?: string;

    @IsOptional()
    @IsString()
    district?: string;

    @IsOptional()
    @IsString()
    subDistrict?: string;

    @IsOptional()
    @IsString()
    zipCode?: string;

    @IsOptional()
    @IsString()
    idCardSelfie?: string;

    @IsOptional()
    roleRank?: number;

    @IsString()
    @MinLength(8)
    password!: string;
}

export class UpdateUserDto {
    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsIn(USER_ROLES)
    role?: 'admin' | 'user' | 'employer';

    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsDateString()
    birthDate?: string;

    @IsOptional()
    @IsString()
    managerCode?: string;

    @IsOptional()
    @IsString()
    workStatus?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    province?: string;

    @IsOptional()
    @IsString()
    district?: string;

    @IsOptional()
    @IsString()
    subDistrict?: string;

    @IsOptional()
    @IsString()
    zipCode?: string;

    @IsOptional()
    @IsString()
    idCardSelfie?: string;

    @IsOptional()
    roleRank?: number;

    @IsOptional()
    @IsString()
    @MinLength(8)
    password?: string;

    @IsOptional()
    @IsBoolean()
    profileCompleted?: boolean;
}

export class SendProfileOtpDto {
    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    phone?: string;
}

export class VerifyProfileOtpDto {
    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    emailOtp?: string;

    @IsOptional()
    @IsString()
    phoneOtp?: string;
}

export class UpdateProfileWithOtpDto {
    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    province?: string;

    @IsOptional()
    @IsString()
    district?: string;

    @IsOptional()
    @IsString()
    subDistrict?: string;

    @IsOptional()
    @IsString()
    zipCode?: string;
}
