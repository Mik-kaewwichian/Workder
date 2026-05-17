import { IsInt, IsString, Min, Max, MinLength } from 'class-validator';

export class CreateUserReviewDto {
    @IsInt()
    authorId!: number;

    @IsInt()
    targetId!: number;

    @IsInt()
    @Min(1)
    @Max(5)
    rating!: number;

    @IsString()
    @MinLength(1)
    comment!: string;
}
