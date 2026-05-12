// src/modules/auth/jwt.strategy.ts
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
    // Verifiko që user-i ekziston ende
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        role: true,
        tenantId: true,
        // isActive: true,  // ← KOMENTOJE OSE FSHIJE (nuk ekziston në schema)
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // if (!user.isActive) {  // ← KOMENTOJE OSE FSHIJE KETE
    //   throw new UnauthorizedException('User is inactive');
    // }

    return {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    };
  }
}
