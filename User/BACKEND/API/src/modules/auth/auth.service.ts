import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { LoginDto } from './auth.dto';

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
			(process.env.AUTH_ALLOWED_ROLES || 'admin,user,employer')
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
			throw new ForbiddenException('This account cannot access the user portal');
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

	async getProfile(userId: number) {
		return this.usersService.getMe(userId);
	}

	async verifyToken(token: string) {
		return this.jwtService.verifyAsync<AuthTokenPayload>(token, {
			secret: process.env.JWT_SECRET || 'workder-dev-secret',
		});
	}
}
