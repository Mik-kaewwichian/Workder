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
}// users DTO placeholder
