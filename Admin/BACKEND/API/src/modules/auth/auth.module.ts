import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { OAuthController } from './oauth.controller';
import { SocialAuthService } from './social-auth.service';

@Module({
	imports: [
		JwtModule.register({
			secret: process.env.JWT_SECRET || 'workder-dev-secret',
			signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
		}),
		UsersModule,
	],
	controllers: [AuthController, OAuthController],
	providers: [AuthService, SocialAuthService, JwtAuthGuard],
	exports: [AuthService, SocialAuthService, JwtAuthGuard],
})
export class AuthModule { }
