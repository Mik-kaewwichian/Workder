import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class StartConversationDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    jobId?: number;

    @Type(() => Number)
    @IsInt()
    employerId!: number;

    @Type(() => Number)
    @IsInt()
    workerId!: number;
}

export class SendMessageDto {
    @Type(() => Number)
    @IsInt()
    conversationId!: number;

    @Type(() => Number)
    @IsInt()
    senderId!: number;

    @IsString()
    @MinLength(1)
    text!: string;
}
