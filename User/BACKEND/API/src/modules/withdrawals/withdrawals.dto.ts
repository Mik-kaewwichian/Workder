import { IsBoolean, IsInt, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBankAccountDto {
    @IsString()
    @MinLength(2)
    @MaxLength(20)
    bankCode!: string;

    @IsString()
    @MinLength(2)
    @MaxLength(60)
    bankName!: string;

    @IsString()
    @MinLength(6)
    @MaxLength(30)
    accountNumber!: string;

    @IsString()
    @MinLength(2)
    @MaxLength(80)
    accountName!: string;

    @IsBoolean()
    @IsOptional()
    isDefault?: boolean;
}

export class CreateWithdrawalDto {
    /** Amount to withdraw, in whole THB. */
    @Type(() => Number)
    @IsInt()
    @Min(1)
    amount!: number;

    @Type(() => Number)
    @IsInt()
    bankAccountId!: number;
}

export class RejectWithdrawalDto {
    @IsString()
    @IsOptional()
    @MaxLength(300)
    reason?: string;
}
