import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GoogleOAuthDto {
    @IsString()
    @IsNotEmpty()
    idToken!: string;

    @IsOptional()
    @IsString()
    @IsIn(['user', 'worker', 'employer'])
    role?: 'user' | 'worker' | 'employer';
}

export class FacebookOAuthDto {
    @IsString()
    @IsNotEmpty()
    accessToken!: string;

    @IsString()
    @IsNotEmpty()
    userID!: string;

    @IsOptional()
    @IsString()
    @IsIn(['user', 'worker', 'employer'])
    role?: 'user' | 'worker' | 'employer';
}
