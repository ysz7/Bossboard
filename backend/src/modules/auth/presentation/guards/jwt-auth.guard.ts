// JwtAuthGuard — protects routes that require authentication
// Usage: add @UseGuards(JwtAuthGuard) to any controller or route
//
// Flow:
//   Request → JwtAuthGuard → JwtStrategy.validate() → route handler
//   If token is missing or invalid → 401 Unauthorized (automatically)

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
