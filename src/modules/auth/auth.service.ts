// src/modules/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { Role as PrismaRole } from '@prisma/client'; // Importo enum-in e Prisma-s
import { Role } from './enums/role.enum.js';

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

    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        password: hashedPassword,
        tenantId: dto.tenantId,
        role: PrismaRole.USER,
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
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

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
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async getAllUsers(tenantId: string, requesterRole: Role) {
    // Super Admin sheh të gjithë userat nga të gjithë tenantët
    if (requesterRole === Role.SUPER_ADMIN) {
      return this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          tenantId: true,
          createdAt: true,
        },
      });
    }

    return this.prisma.user.findMany({
      where: { tenantId },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async getAllTenants() {
    return this.prisma.tenant.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
        _count: {
          select: { users: true },
        },
      },
    });
  }

  async changeUserRole(userId: string, newRole: Role, requester: any) {
    const targetUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    let prismaRole: PrismaRole;
    switch (newRole) {
      case Role.USER:
        prismaRole = PrismaRole.USER;
        break;
      case Role.ADMIN:
        prismaRole = PrismaRole.ADMIN;
        break;
      case Role.SUPER_ADMIN:
        prismaRole = PrismaRole.SUPER_ADMIN;
        break;
      case Role.TENANT_ADMIN:
        prismaRole = PrismaRole.ADMIN;
        break;
      default:
        throw new BadRequestException('Invalid role');
    }

    if (requester.role === Role.SUPER_ADMIN) {
      return this.prisma.user.update({
        where: { id: userId },
        data: { role: prismaRole },
        select: { id: true, email: true, role: true },
      });
    }

    if (requester.role === Role.TENANT_ADMIN) {
      if (targetUser.tenantId !== requester.tenantId) {
        throw new ForbiddenException('Cannot manage users from other tenants');
      }
      if (newRole !== Role.USER && newRole !== Role.ADMIN) {
        throw new ForbiddenException(
          'Tenant Admin can only assign USER or ADMIN roles',
        );
      }
      if (targetUser.role.toString() === Role.TENANT_ADMIN) {
        throw new ForbiddenException(
          'Cannot change role of another Tenant Admin',
        );
      }

      return this.prisma.user.update({
        where: { id: userId },
        data: { role: prismaRole },
        select: { id: true, email: true, role: true },
      });
    }

    throw new ForbiddenException('Insufficient permissions');
  }
}
