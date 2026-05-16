import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminResetPasswordDto, LoginDto } from './auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) { }

	@Post('login')
	login(@Body() loginDto: LoginDto) {
		return this.authService.login(loginDto);
	}

	@Post('reset-password-admin')
	async resetPasswordAdmin(@Body() dto: AdminResetPasswordDto) {
		await this.authService.resetPasswordAdmin(dto);
		return { message: 'Password updated successfully' };
	}

	@Post('verify-admin-reset-data')
	async verifyAdminResetData(@Body() dto: { email: string; idCard: string; phone: string }) {
		await this.authService.verifyAdminResetData(dto);
		return { success: true };
	}

	@UseGuards(JwtAuthGuard)
	@Get('me')
	me(@Req() request: { user: { sub: number } }) {
		return this.authService.getProfile(request.user.sub);
	}
}
