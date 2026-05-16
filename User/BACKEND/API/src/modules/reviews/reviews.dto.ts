import { IsInt, IsString, Min, Max, MinLength, IsOptional } from 'class-validator';

export class CreateReviewDto {
    @IsInt()
    jobId!: number;

    @IsInt()
    authorId!: number;

    @IsInt()
    @Min(1)
    @Max(5)
    rating!: number;

    @IsString()
    @MinLength(1)
    comment!: string;
}

export class UpdateReviewDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(5)
    rating?: number;

    @IsOptional()
    @IsString()
    @MinLength(1)
    comment?: string;
}
