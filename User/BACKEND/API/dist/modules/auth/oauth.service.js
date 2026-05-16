"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../infra/prisma/prisma.service");
let OAuthService = class OAuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async googleSignIn(dto) {
        const tokenInfo = await this.verifyGoogleIdToken(dto.idToken);
        const email = tokenInfo.email?.trim().toLowerCase();
        if (!email) {
            throw new common_1.BadRequestException('Google account does not provide email');
        }
        const firstName = (tokenInfo.given_name || '').trim();
        const lastName = (tokenInfo.family_name || '').trim();
        return this.findOrCreateUserAndIssueToken(email, firstName, lastName, dto.role);
    }
    async facebookSignIn(dto) {
        const profile = await this.verifyFacebookAccessToken(dto.accessToken, dto.userID);
        const email = profile.email?.trim().toLowerCase();
        if (!email) {
            throw new common_1.BadRequestException('Facebook account does not provide email');
        }
        const firstName = (profile.first_name || '').trim();
        const lastName = (profile.last_name || '').trim();
        return this.findOrCreateUserAndIssueToken(email, firstName, lastName, dto.role);
    }
    async verifyGoogleIdToken(idToken) {
        const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
        if (!response.ok) {
            throw new common_1.UnauthorizedException('Invalid Google token');
        }
        const tokenInfo = await response.json();
        const expectedAudience = process.env.GOOGLE_CLIENT_ID?.trim();
        if (expectedAudience && tokenInfo.aud !== expectedAudience) {
            throw new common_1.UnauthorizedException('Google token audience mismatch');
        }
        if (!tokenInfo.sub || !tokenInfo.email) {
            throw new common_1.UnauthorizedException('Google token payload is incomplete');
        }
        return tokenInfo;
    }
    async verifyFacebookAccessToken(accessToken, expectedUserId) {
        const endpoint = new URL('https://graph.facebook.com/me');
        endpoint.searchParams.set('fields', 'id,email,first_name,last_name,name');
        endpoint.searchParams.set('access_token', accessToken);
        const response = await fetch(endpoint.toString());
        if (!response.ok) {
            throw new common_1.UnauthorizedException('Invalid Facebook token');
        }
        const profile = await response.json();
        if (!profile.id || profile.id !== expectedUserId) {
            throw new common_1.UnauthorizedException('Facebook user mismatch');
        }
        return profile;
    }
    async findOrCreateUserAndIssueToken(email, firstName, lastName, requestedRole) {
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
};
exports.OAuthService = OAuthService;
exports.OAuthService = OAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], OAuthService);
