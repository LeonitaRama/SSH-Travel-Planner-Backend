// src/modules/auth/jwt.strategy.ts (i plotësuar)
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        username: true, // ← SHTUAR
        role: true,
        tenantId: true,
        // isActive: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // if (!user.isActive) {
    //   throw new UnauthorizedException('User account is inactive');
    // }

    return {
      sub: user.id,
      email: user.email,
      username: user.username, // ← SHTUAR
      role: user.role,
      tenantId: user.tenantId,
    };
  }
}
