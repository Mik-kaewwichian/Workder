import { IsInt, IsOptional, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateApplicationDto {
    @Type(() => Number)
    @IsInt()
    jobId!: number;

    @Type(() => Number)
    @IsInt()
    workerId!: number;

    @IsString()
    @IsOptional()
    message?: string;
}

export class UpdateApplicationStatusDto {
    @IsString()
    @IsIn(['accepted', 'rejected', 'pending'])
    status!: string;
}
