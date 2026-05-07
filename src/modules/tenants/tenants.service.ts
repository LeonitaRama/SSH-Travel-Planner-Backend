// src/modules/tenants/tenants.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTenantDto) {
    // Verifiko nëse slug ekziston
    const existingTenant = await this.prisma.tenant.findUnique({
      where: { slug: dto.slug },
    });

    if (existingTenant) {
      throw new ConflictException(
        `Tenant with slug "${dto.slug}" already exists`,
      );
    }

    return this.prisma.tenant.create({
      data: {
        name: dto.name,
        slug: dto.slug,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
      },
    });
  }

  async findAll() {
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
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      include: {
        users: {
          select: { id: true, email: true, role: true, createdAt: true },
        },
      },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }

    return tenant;
  }

  async findBySlug(slug: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug },
      select: { id: true, name: true, slug: true, createdAt: true },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with slug "${slug}" not found`);
    }

    return tenant;
  }

  async update(id: string, data: { name?: string; slug?: string }) {
    const tenant = await this.prisma.tenant.update({
      where: { id },
      data,
      select: { id: true, name: true, slug: true },
    });

    return tenant;
  }

  async remove(id: string) {
    // Fshi fillimisht të gjithë user-at e tenant-it
    await this.prisma.user.deleteMany({
      where: { tenantId: id },
    });

    // Pastaj fshi tenant-in
    await this.prisma.tenant.delete({
      where: { id },
    });

    return { message: 'Tenant deleted successfully', tenantId: id };
  }
}
