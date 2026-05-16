import { IsInt, IsString, IsOptional, IsBoolean, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWorkerPostDto {
    @IsInt()
    @Type(() => Number)
    workerId!: number;

    @IsString()
    @MinLength(1)
    headline!: string;

    @IsString()
    @MinLength(1)
    skills!: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    expectedPay?: number;
}

export class UpdateWorkerPostDto {
    @IsOptional()
    @IsString()
    headline?: string;

    @IsOptional()
    @IsString()
    skills?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    expectedPay?: number;

    @IsOptional()
    @IsBoolean()
    available?: boolean;
}
