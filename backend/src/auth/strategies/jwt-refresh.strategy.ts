import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtRefreshPayload, JwtPayload } from '../types/jwt-payload.type';

interface RefreshTokenClaims {
  sub: string;
  email: string;
  role: JwtPayload['role'];
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: RefreshTokenClaims): JwtRefreshPayload {
    const refreshToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      refreshToken: refreshToken as string,
    };
  }
}
