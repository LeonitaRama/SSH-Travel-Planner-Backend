// src/modules/users/users.service.ts
import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { BaseTenantService } from '../../common/services/base-tenant.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { Role } from '../../common/enums/role.enum.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService extends BaseTenantService {
  constructor(private prismaService: PrismaService) {
    super(prismaService);
  }

  async validateTenantAccess(
    tenantId: string,
    userId: string,
  ): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, tenantId },
    });
    return !!user;
  }

  async findAllByTenant(tenantId: string) {
    return this.prisma.user.findMany({
      where: { tenantId },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, userId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        tenantId: tenantId,
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        tenantId: true,
      },
    });

    if (!user) {
      throw new NotFoundException(
        `User with ID ${userId} not found in this tenant`,
      );
    }

    return user;
  }

  // src/modules/users/users.service.ts (rreshti 74)
  async create(tenantId: string, dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: dto.role || Role.CUSTOMER, // ← Ndrysho nga Role.USER në Role.CUSTOMER
        tenantId: tenantId,
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async update(tenantId: string, userId: string, dto: UpdateUserDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: { id: userId, tenantId },
    });

    if (!existingUser) {
      throw new NotFoundException(
        `User with ID ${userId} not found in this tenant`,
      );
    }

    const updateData: any = {};

    if (dto.email) updateData.email = dto.email;
    if (dto.password) updateData.password = await bcrypt.hash(dto.password, 10);
    if (dto.role) updateData.role = dto.role;

    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async remove(tenantId: string, userId: string) {
    const existingUser = await this.prisma.user.findFirst({
      where: { id: userId, tenantId },
    });

    if (!existingUser) {
      throw new NotFoundException(
        `User with ID ${userId} not found in this tenant`,
      );
    }

    await this.prisma.user.delete({
      where: { id: userId },
    });

    return {
      message: 'User deleted successfully',
      deletedUserId: userId,
      tenantId: tenantId,
    };
  }

  async countUsersByTenant(tenantId: string): Promise<number> {
    return this.prisma.user.count({
      where: { tenantId },
    });
  }
}
