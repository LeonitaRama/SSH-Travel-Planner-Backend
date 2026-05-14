import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { JwtService } from '@nestjs/jwt';
import { BaseAuthService } from '../../common/services/base-auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { Role } from '../../common/enums/role.enum.js';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto'; // Importo për gjenerimin e token-it

@Injectable()
export class AuthService extends BaseAuthService {
  constructor(
    protected prismaService: PrismaService,
    protected jwtService: JwtService,
  ) {
    super(prismaService, jwtService);
  }

  // Metodë ndihmëse private për të mos përsëritur kodin (DRY)
  private async createRefreshToken(userId: string, tenantId: string) {
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Valid për 7 ditë

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: userId,
        tenantId: tenantId,
        expiresAt: expiresAt,
      },
    });

    return refreshToken;
  }

  async register(dto: RegisterDto) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: dto.tenantId },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    const existingUser = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
        tenantId: dto.tenantId,
      },
    });

    if (existingUser) {
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
        role: dto.role || Role.CUSTOMER,
      },
    });

    const accessToken = this.generateToken(user);
    const refreshToken = await this.createRefreshToken(user.id, user.tenantId);

    return {
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async login(tenantId: string, dto: LoginDto) {
    const user = await this.validateUser(tenantId, dto.email, dto.password);

    const accessToken = this.generateToken(user);
    const refreshToken = await this.createRefreshToken(user.id, user.tenantId);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    };
  }

  async refreshToken(token: string) {
    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { token: token },
      include: { user: true },
    });

    if (!tokenRecord) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (tokenRecord.expiresAt < new Date()) {
      await this.prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
      throw new UnauthorizedException('Refresh token expired');
    }

    // Opsionale: Fshijmë tokenin e vjetër (Token Rotation) për siguri më të lartë
    await this.prisma.refreshToken.delete({ where: { id: tokenRecord.id } });

    const newAccessToken = this.generateToken(tokenRecord.user);
    const newRefreshToken = await this.createRefreshToken(
      tokenRecord.userId,
      tokenRecord.tenantId,
    );

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    };
  }

  // Metodat e tjera mbeten të njëjta...
  async getProfile(userId: string) {
    return this.getUserFromToken(userId);
  }

  async logout(userId: string) {
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });
    return { message: 'Logged out successfully' };
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
