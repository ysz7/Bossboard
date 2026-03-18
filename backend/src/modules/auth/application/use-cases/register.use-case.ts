// RegisterUseCase — handles user registration business logic
// It doesn't know about HTTP, controllers, or Prisma — only domain rules

import { Injectable, ConflictException, Inject } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import type { IAuthRepository } from '../../domain/repositories/auth.repository.interface';
import { AUTH_REPOSITORY } from '../../domain/repositories/auth.repository.interface';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: IAuthRepository,
  ) {}

  async execute(email: string, password: string): Promise<User> {
    // Check if user with this email already exists
    const existing = await this.authRepository.findByEmail(email);
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash the password before saving — never store plain text passwords
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.authRepository.create(email, hashedPassword);
  }
}
