import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { AdminResetPasswordDto, LoginDto } from './auth.dto';

type AuthTokenPayload = {
	sub: number;
	email: string;
	role: string;
};

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
	) { }

	private getAllowedRoles() {
		return new Set(
			(process.env.AUTH_ALLOWED_ROLES || 'admin')
				.split(',')
				.map((role) => role.trim())
				.filter(Boolean),
		);
	}

	async login(dto: LoginDto) {
		const user = await this.usersService.findByEmail(dto.email);

		if (!user || !user.email || !user.passwordHash) {
			throw new UnauthorizedException('Invalid email or password');
		}

		const passwordMatches = await compare(dto.password, user.passwordHash);

		if (!passwordMatches) {
			throw new UnauthorizedException('Invalid email or password');
		}

		if (!this.getAllowedRoles().has(user.role)) {
			throw new ForbiddenException('This account cannot access the admin portal');
		}

		const payload: AuthTokenPayload = {
			sub: user.id,
			email: user.email,
			role: user.role,
		};

		return {
			accessToken: await this.jwtService.signAsync(payload),
			user: this.usersService.toPublicUser(user),
		};
	}

	async resetPasswordAdmin(dto: AdminResetPasswordDto) {
		const user = await this.usersService.findByEmail(dto.email);

		if (!user || !user.email) {
			throw new UnauthorizedException('Invalid email or manager code');
		}

		if (!this.getAllowedRoles().has(user.role)) {
			throw new ForbiddenException('This account cannot access the admin portal');
		}

		if (user.managerCode !== dto.managerCode) {
			throw new UnauthorizedException('Invalid manager code');
		}

		if ((user.idCard || '') !== dto.idCard) {
			throw new UnauthorizedException('Invalid employee ID');
		}

		if ((user.phone || '') !== dto.phone) {
			throw new UnauthorizedException('Invalid phone number');
		}

		await this.usersService.updateUser({
			where: { id: user.id },
			data: { password: dto.newPassword }
		});

		return { success: true, message: 'Password reset successfully' };
	}

	async verifyAdminResetData(dto: { email: string; idCard: string; phone: string }): Promise<void> {
		const user = await this.usersService.user({ email: dto.email });

		if (!user) {
			throw new UnauthorizedException('Invalid employee ID, phone or email');
		}

		if ((user.idCard || '') !== dto.idCard) {
			throw new UnauthorizedException('Invalid employee ID, phone or email');
		}

		if ((user.phone || '') !== dto.phone) {
			throw new UnauthorizedException('Invalid employee ID, phone or email');
		}
	}

	async getProfile(userId: number) {
		return this.usersService.user({ id: userId });
	}

	async verifyToken(token: string) {
		return this.jwtService.verifyAsync<AuthTokenPayload>(token, {
			secret: process.env.JWT_SECRET || 'workder-dev-secret',
		});
	}
}
