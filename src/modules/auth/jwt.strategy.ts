// src/modules/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service.js';
import { Role } from '../auth/enums/role.enum.js';

interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
  tenantId: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        role: true,
        tenantId: true,
        username: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Konverto rolin nga string në enum
    const userRole = user.role as Role;

    return {
      sub: user.id,
      email: user.email,
      role: userRole,
      tenantId: user.tenantId,
      username: user.username,
    };
  }
}
