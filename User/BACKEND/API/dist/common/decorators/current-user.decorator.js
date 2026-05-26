"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentUser = exports.CurrentUserId = void 0;
const common_1 = require("@nestjs/common");
/**
 * Resolves the authenticated user's id from the JWT (set on request.user by
 * JwtAuthGuard). Use on guarded routes so money endpoints never trust a
 * client-supplied id. Throws if the route is not behind JwtAuthGuard.
 */
exports.CurrentUserId = (0, common_1.createParamDecorator)((_data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const sub = request.user?.sub;
    if (typeof sub !== 'number') {
        throw new common_1.UnauthorizedException('Authentication required');
    }
    return sub;
});
/** Full auth payload variant, when email/role are also needed. */
exports.CurrentUser = (0, common_1.createParamDecorator)((_data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.user) {
        throw new common_1.UnauthorizedException('Authentication required');
    }
    return request.user;
});
