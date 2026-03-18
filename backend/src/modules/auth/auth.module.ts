// AuthModule — registers all pieces of the auth feature together
// DI (Dependency Injection) wires everything up here

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './presentation/auth.controller';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { PrismaAuthRepository } from './infrastructure/prisma-auth.repository';
import { AUTH_REPOSITORY } from './domain/repositories/auth.repository.interface';
import { JwtStrategy } from './infrastructure/jwt.strategy';

@Module({
  imports: [
    // PassportModule enables the @UseGuards(AuthGuard(...)) mechanism
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    RegisterUseCase,
    LoginUseCase,
    // JwtStrategy is a provider — Passport discovers it automatically by name 'jwt'
    JwtStrategy,
    {
      provide: AUTH_REPOSITORY,
      useClass: PrismaAuthRepository,
    },
  ],
})
export class AuthModule {}
