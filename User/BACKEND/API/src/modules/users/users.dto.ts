import { IsBoolean, IsDateString, IsEmail, IsIn, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

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
    @MinLength(8)
    password?: string;

    @IsOptional()
    @IsBoolean()
    profileCompleted?: boolean;

    // Profile fields
    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    occupation?: string;

    @IsOptional()
    @IsString()
    education?: string;

    @IsOptional()
    @IsString()
    certificates?: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    income?: number;

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
    idCard?: string;

    @IsOptional()
    @IsString()
    idCardFront?: string;

    @IsOptional()
    @IsString()
    idCardBack?: string;

    @IsOptional()
    @IsString()
    idCardSelfie?: string;

    @IsOptional()
    @IsString()
    faceScan?: string;

    @IsOptional()
    @IsString()
    avatar?: string;

    @IsOptional()
    @IsString()
    banner?: string;
}
