import { Body, Controller, Post } from '@nestjs/common';
import { SocialAuthService } from './social-auth.service';
import { FacebookOAuthDto, GoogleOAuthDto } from './oauth.dto';

@Controller('auth/oauth')
export class OAuthController {
    constructor(private readonly oauthService: SocialAuthService) { }

    @Post('google')
    google(@Body() dto: GoogleOAuthDto) {
        return this.oauthService.googleSignIn(dto);
    }

    @Post('facebook')
    facebook(@Body() dto: FacebookOAuthDto) {
        return this.oauthService.facebookSignIn(dto);
    }
}
