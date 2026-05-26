import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTopUpDto {
    /** Amount to top up, in whole THB (baht). Converted to satang internally. */
    @Type(() => Number)
    @IsInt()
    @Min(20) // Omise PromptPay minimum
    @Max(100000)
    amount!: number;
}

export class ListTransactionsDto {
    /** Cursor: return entries with id < cursor (newest first). */
    @Type(() => Number)
    @IsInt()
    @IsOptional()
    cursor?: number;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    @IsOptional()
    take?: number;
}
