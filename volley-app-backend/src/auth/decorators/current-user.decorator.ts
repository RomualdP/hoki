import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../types/user.type';

interface RequestWithUser {
  user: User;
}

/**
 * Decorator to get the current authenticated user from the request
 * Requires JwtAuthGuard to be applied on the route
 * @returns The full User object from the database
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);

/**
 * Decorator to get only the current user's ID from the request
 * Requires JwtAuthGuard to be applied on the route
 * @returns The user ID (string)
 */
export const CurrentUserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user.id;
  },
);

/**
 * Decorator to get the current user's clubId from the request
 * Requires JwtAuthGuard to be applied on the route
 * @returns The club ID (string | null)
 */
export const CurrentClubId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string | null => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user.clubId ?? null;
  },
);
