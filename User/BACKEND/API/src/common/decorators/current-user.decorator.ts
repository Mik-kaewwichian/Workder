import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

type AuthUser = { sub: number; email: string; role: string };

/**
 * Resolves the authenticated user's id from the JWT (set on request.user by
 * JwtAuthGuard). Use on guarded routes so money endpoints never trust a
 * client-supplied id. Throws if the route is not behind JwtAuthGuard.
 */
export const CurrentUserId = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): number => {
        const request = ctx.switchToHttp().getRequest<{ user?: AuthUser }>();
        const sub = request.user?.sub;
        if (typeof sub !== 'number') {
            throw new UnauthorizedException('Authentication required');
        }
        return sub;
    },
);

/** Full auth payload variant, when email/role are also needed. */
export const CurrentUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): AuthUser => {
        const request = ctx.switchToHttp().getRequest<{ user?: AuthUser }>();
        if (!request.user) {
            throw new UnauthorizedException('Authentication required');
        }
        return request.user;
    },
);
