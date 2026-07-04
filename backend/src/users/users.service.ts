import { Injectable } from '@nestjs/common';
import { Lang, Role, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type SafeUser = Omit<User, 'passwordHash' | 'refreshTokenHash'>;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  create(data: {
    email: string;
    passwordHash: string;
    name: string;
    language?: Lang;
    role?: Role;
  }) {
    return this.prisma.user.create({ data });
  }

  updateRefreshTokenHash(userId: string, refreshTokenHash: string | null) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash },
    });
  }

  update(
    userId: string,
    data: { name?: string; avatarUrl?: string; language?: Lang },
  ) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  toSafeUser(user: User): SafeUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      role: user.role,
      language: user.language,
      createdAt: user.createdAt,
    };
  }
}
