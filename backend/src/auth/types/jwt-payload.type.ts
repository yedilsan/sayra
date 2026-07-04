import { Role } from '@prisma/client';

export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
}

export interface JwtRefreshPayload extends JwtPayload {
  refreshToken: string;
}
