// Prisma implementation of IAuthRepository
// This is the only place in auth module that knows about the database

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IAuthRepository } from '../domain/repositories/auth.repository.interface';
import { User } from '../domain/entities/user.entity';

@Injectable()
export class PrismaAuthRepository implements IAuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    return new User(
      user.id,
      user.email,
      user.password,
      user.createdAt,
      user.updatedAt,
    );
  }

  async create(email: string, hashedPassword: string): Promise<User> {
    const user = await this.prisma.user.create({
      data: { email, password: hashedPassword },
    });

    return new User(
      user.id,
      user.email,
      user.password,
      user.createdAt,
      user.updatedAt,
    );
  }
}
