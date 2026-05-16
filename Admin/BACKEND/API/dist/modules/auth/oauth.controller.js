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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthController = void 0;
const common_1 = require("@nestjs/common");
const social_auth_service_1 = require("./social-auth.service");
const oauth_dto_1 = require("./oauth.dto");
let OAuthController = class OAuthController {
    oauthService;
    constructor(oauthService) {
        this.oauthService = oauthService;
    }
    async handleGoogleOAuth(dto) {
        return this.oauthService.handleGoogleOAuth(dto.idToken, dto.role);
    }
    async handleFacebookOAuth(dto) {
        return this.oauthService.handleFacebookOAuth(dto.accessToken, dto.userID, dto.role);
    }
};
exports.OAuthController = OAuthController;
__decorate([
    (0, common_1.Post)('google'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [oauth_dto_1.GoogleOAuthDto]),
    __metadata("design:returntype", Promise)
], OAuthController.prototype, "handleGoogleOAuth", null);
__decorate([
    (0, common_1.Post)('facebook'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [oauth_dto_1.FacebookOAuthDto]),
    __metadata("design:returntype", Promise)
], OAuthController.prototype, "handleFacebookOAuth", null);
exports.OAuthController = OAuthController = __decorate([
    (0, common_1.Controller)('auth/oauth'),
    __metadata("design:paramtypes", [social_auth_service_1.SocialAuthService])
], OAuthController);
