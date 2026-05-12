import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // Verifiko që tenant-i ekziston
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: dto.tenantId },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    // Verifiko që user-i nuk ekziston në këtë tenant
    const userExists = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
        tenantId: dto.tenantId,
      },
    });

    if (userExists) {
      throw new BadRequestException('User already exists in this tenant');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // src/modules/auth/auth.service.ts (rreshti 50)
    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        password: hashedPassword,
        tenantId: dto.tenantId,
        role: 'CUSTOMER', // ← Ndrysho nga 'USER' në 'CUSTOMER'
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        tenantId: true,
        createdAt: true,
      },
    });
    // Krijo token
    const token = this.jwt.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    });

    return {
      message: 'User registered successfully',
      user,
      access_token: token,
    };
  }

  async login(tenantId: string, dto: LoginDto) {
    // Verifiko që tenant-i ekziston
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    // Gjej user-in në këtë tenant
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
        tenantId: tenantId,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwt.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    });

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        tenantId: true,
        createdAt: true,
        /*bookings: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },*/
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async logout(userId: string) {
    // Fshij të gjitha refresh token-at për këtë user
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });

    return { message: 'Logged out successfully' };
  }

  async refreshToken(refreshToken: string) {
    // Gjej refresh token-in në database
    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!tokenRecord) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Kontrollo nëse ka skaduar
    if (tokenRecord.expiresAt < new Date()) {
      await this.prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
      throw new UnauthorizedException('Refresh token expired');
    }

    // Gjenero token të ri
    const newToken = this.jwt.sign({
      sub: tokenRecord.user.id,
      email: tokenRecord.user.email,
      role: tokenRecord.user.role,
      tenantId: tokenRecord.user.tenantId,
    });

    return { access_token: newToken };
  }
}
