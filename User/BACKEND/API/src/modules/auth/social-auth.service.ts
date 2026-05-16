import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { FacebookOAuthDto, GoogleOAuthDto } from './oauth.dto';

type GoogleTokenInfo = {
    aud?: string;
    sub?: string;
    email?: string;
    email_verified?: string;
    given_name?: string;
    family_name?: string;
    name?: string;
};

type FacebookProfile = {
    id?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    name?: string;
};

@Injectable()
export class SocialAuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

    async googleSignIn(dto: GoogleOAuthDto) {
        const tokenInfo = await this.verifyGoogleIdToken(dto.idToken);
        const email = tokenInfo.email?.trim().toLowerCase();

        if (!email) {
            throw new BadRequestException('Google account does not provide email');
        }

        const firstName = (tokenInfo.given_name || '').trim();
        const lastName = (tokenInfo.family_name || '').trim();
        return this.findOrCreateUserAndIssueToken(email, firstName, lastName, dto.role);
    }

    async facebookSignIn(dto: FacebookOAuthDto) {
        const profile = await this.verifyFacebookAccessToken(dto.accessToken, dto.userID);
        const email = profile.email?.trim().toLowerCase();

        if (!email) {
            throw new BadRequestException('Facebook account does not provide email');
        }

        const firstName = (profile.first_name || '').trim();
        const lastName = (profile.last_name || '').trim();
        return this.findOrCreateUserAndIssueToken(email, firstName, lastName, dto.role);
    }

    private async verifyGoogleIdToken(idToken: string): Promise<GoogleTokenInfo> {
        const response = await fetch(
            `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`,
        );

        if (!response.ok) {
            throw new UnauthorizedException('Invalid Google token');
        }

        const tokenInfo = await response.json() as GoogleTokenInfo;
        const expectedAudience = process.env.GOOGLE_CLIENT_ID?.trim();

        if (expectedAudience && tokenInfo.aud !== expectedAudience) {
            throw new UnauthorizedException('Google token audience mismatch');
        }

        if (!tokenInfo.sub || !tokenInfo.email) {
            throw new UnauthorizedException('Google token payload is incomplete');
        }

        return tokenInfo;
    }

    private async verifyFacebookAccessToken(accessToken: string, expectedUserId: string): Promise<FacebookProfile> {
        const endpoint = new URL('https://graph.facebook.com/me');
        endpoint.searchParams.set('fields', 'id,email,first_name,last_name,name');
        endpoint.searchParams.set('access_token', accessToken);

        const response = await fetch(endpoint.toString());

        if (!response.ok) {
            throw new UnauthorizedException('Invalid Facebook token');
        }

        const profile = await response.json() as FacebookProfile;

        if (!profile.id || profile.id !== expectedUserId) {
            throw new UnauthorizedException('Facebook user mismatch');
        }

        return profile;
    }

    private async findOrCreateUserAndIssueToken(
        email: string,
        firstName: string,
        lastName: string,
        requestedRole?: 'user' | 'worker' | 'employer',
    ) {
        const normalizedRole = requestedRole === 'employer' ? 'employer' : 'user';

        let user = await this.prisma.user.findFirst({
            where: { email },
        });

        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    email,
                    role: normalizedRole,
                    firstName: firstName || undefined,
                    lastName: lastName || undefined,
                    profileCompleted: false,
                },
            });
        }

        const payload = {
            sub: user.id,
            email: user.email ?? '',
            role: user.role,
        };

        const accessToken = await this.jwtService.signAsync(payload);

        return {
            accessToken,
            user: {
                id: user.id,
                email: user.email ?? '',
                role: user.role,
                profileCompleted: user.profileCompleted,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        };
    }
}
