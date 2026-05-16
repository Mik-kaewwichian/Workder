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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcryptjs_1 = require("bcryptjs");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    usersService;
    jwtService;
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    getAllowedRoles() {
        return new Set((process.env.AUTH_ALLOWED_ROLES || 'admin,user,employer')
            .split(',')
            .map((role) => role.trim())
            .filter(Boolean));
    }
    async login(dto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user || !user.email || !user.passwordHash) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const passwordMatches = await (0, bcryptjs_1.compare)(dto.password, user.passwordHash);
        if (!passwordMatches) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        if (!this.getAllowedRoles().has(user.role)) {
            throw new common_1.ForbiddenException('This account cannot access the user portal');
        }
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        return {
            accessToken: await this.jwtService.signAsync(payload),
            user: this.usersService.toPublicUser(user),
        };
    }
    async getProfile(userId) {
        return this.usersService.user({ id: userId });
    }
    async verifyToken(token) {
        return this.jwtService.verifyAsync(token, {
            secret: process.env.JWT_SECRET || 'workder-dev-secret',
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
