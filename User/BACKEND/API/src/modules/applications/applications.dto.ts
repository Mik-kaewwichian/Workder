import { IsInt, IsOptional, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateApplicationDto {
    @Type(() => Number)
    @IsInt()
    jobId!: number;

    /** Populated from the JWT by the controller — not trusted from the request body. */
    @Type(() => Number)
    @IsInt()
    @IsOptional()
    workerId?: number;

    @IsString()
    @IsOptional()
    message?: string;
}

export class UpdateApplicationStatusDto {
    @IsString()
    @IsIn(['accepted', 'rejected', 'pending'])
    status!: string;
}
