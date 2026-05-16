import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
	@IsEmail()
	email!: string;

	@IsString()
	@MinLength(8)
	password!: string;
}

export class AdminResetPasswordDto {
	@IsEmail()
	email!: string;

	@IsString()
	managerCode!: string;

	@IsString()
	idCard!: string;

	@IsString()
	phone!: string;

	@IsString()
	@MinLength(8)
	newPassword!: string;
}

export class AdminVerifyResetDataDto {
	@IsEmail()
	email!: string;

	@IsString()
	idCard!: string;

	@IsString()
	phone!: string;
}

