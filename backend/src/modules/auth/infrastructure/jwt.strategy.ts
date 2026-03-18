// JwtStrategy — tells Passport HOW to validate a JWT token
// When a request comes in with "Authorization: Bearer <token>":
//   1. Passport extracts the token from the header
//   2. Verifies the signature using JWT_SECRET
//   3. Calls validate() with the decoded payload
//   4. The return value of validate() is attached to request.user

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// Shape of the JWT payload we created in LoginUseCase
interface JwtPayload {
  sub: number; // user id
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Extract token from "Authorization: Bearer <token>" header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Reject tokens that have expired
      ignoreExpiration: false,
      // Same secret we used to sign the token
      secretOrKey: process.env.JWT_SECRET || 'secret',
    });
  }

  // Called automatically by Passport after token signature is verified
  // Whatever we return here will be available as request.user
  validate(payload: JwtPayload) {
    return { id: payload.sub, email: payload.email };
  }
}
