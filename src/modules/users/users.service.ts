// src/modules/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { BaseCrudService } from '../../common/services/base-crud.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { Role } from '../../common/enums/role.enum.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService extends BaseCrudService<
  any,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(protected prismaService: PrismaService) {
    super(prismaService, {
      modelName: 'user',
      defaultSelect: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  // Override create për të hashur password-in
  async create(tenantId: string, dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return super.create(tenantId, {
      ...dto,
      password: hashedPassword,
      role: dto.role || Role.CUSTOMER,
    });
  }

  // Override update për të hashur password-in nëse ndryshon
  async update(tenantId: string, id: string, dto: UpdateUserDto) {
    const updateData: any = { ...dto };

    if (dto.password) {
      updateData.password = await bcrypt.hash(dto.password, 10);
    }

    return super.update(tenantId, id, updateData);
  }

  // Metodë specifike për User që nuk është në BaseCrudService
  async findAllByTenant(tenantId: string) {
    return this.findAll(tenantId);
  }
}
