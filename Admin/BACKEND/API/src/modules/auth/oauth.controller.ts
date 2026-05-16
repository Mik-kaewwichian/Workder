import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { SocialAuthService } from './social-auth.service';
import { GoogleOAuthDto, FacebookOAuthDto } from './oauth.dto';

@Controller('auth/oauth')
export class OAuthController {
    constructor(private readonly oauthService: SocialAuthService) {}

    @Post('google')
    @HttpCode(HttpStatus.OK)
    async handleGoogleOAuth(@Body() dto: GoogleOAuthDto) {
        return this.oauthService.handleGoogleOAuth(dto.idToken, dto.role);
    }

    @Post('facebook')
    @HttpCode(HttpStatus.OK)
    async handleFacebookOAuth(@Body() dto: FacebookOAuthDto) {
        return this.oauthService.handleFacebookOAuth(dto.accessToken, dto.userID, dto.role);
    }
}
