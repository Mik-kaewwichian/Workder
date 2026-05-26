import { IsIn, IsString, MinLength, MaxLength } from 'class-validator';

export class DisputeEscrowDto {
    @IsString()
    @MinLength(5)
    @MaxLength(500)
    reason!: string;
}

export class CancelEscrowDto {
    @IsString()
    @MinLength(10)
    @MaxLength(500)
    reason!: string;
}

export class ResolveDisputeDto {
    @IsString()
    @IsIn(['release', 'refund'])
    outcome!: 'release' | 'refund';
}
