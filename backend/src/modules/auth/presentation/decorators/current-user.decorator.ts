// @CurrentUser() — custom parameter decorator
// Extracts the authenticated user from the request object
//
// Usage in a controller:
//   @Get('me')
//   @UseGuards(JwtAuthGuard)
//   getMe(@CurrentUser() user: CurrentUserType) { ... }
//
// The user object comes from JwtStrategy.validate() return value: { id, email }

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

// Type for the authenticated user attached to the request
export interface CurrentUserType {
  id: number;
  email: string;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUserType => {
    const request = ctx.switchToHttp().getRequest<Request & { user: CurrentUserType }>();
    return request.user;
  },
);
