import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import * as bcrypt from 'bcrypt'; // Shto këtë import për fjalëkalimin
import { Role } from '../../common/enums/role.enum.js'; // Importo Enumin e Roleve
import { UpdateTenantDto } from './dto/update-tenant.dto.js';
@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTenantDto) {
    // 1. Verifiko nëse slug ekziston paraprakisht
    const existingTenant = await this.prisma.tenant.findUnique({
      where: { slug: dto.slug },
    });

    if (existingTenant) {
      throw new ConflictException(
        `Tenant with slug "${dto.slug}" already exists`,
      );
    }

    // 2. Verifiko nëse emaili i adminit është i zënë në sistem
    const existingUser = await this.prisma.user.findFirst({
      where: { email: dto.adminEmail },
    });

    if (existingUser) {
      throw new ConflictException(
        `A user with email "${dto.adminEmail}" already exists in the system`,
      );
    }

    // 3. Hash fjalëkalimin e Adminit të ri
    const hashedPassword = await bcrypt.hash(dto.adminPassword, 10);

    // 4. Ekzekutimi në Transaksion (Nëse dështon user-i, fshihet edhe tenanti automatikisht)
    return this.prisma.$transaction(async (tx) => {
      // Krijojmë Tenant-in
      const tenant = await tx.tenant.create({
        data: {
          name: dto.name,
          slug: dto.slug,
        },
      });

      // Krijojmë User-in e parë me rolin ADMIN të lidhur me këtë tenantId
      const admin = await tx.user.create({
        data: {
          username: dto.adminUsername,
          email: dto.adminEmail,
          password: hashedPassword,
          tenantId: tenant.id,
          role: Role.ADMIN, // <--- Forcohet si ADMIN i kësaj agjencie
        },
      });

      return {
        message: 'Tenant and Admin created successfully',
        tenant: {
          id: tenant.id,
          name: tenant.name,
          slug: tenant.slug,
          createdAt: tenant.createdAt,
        },
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          role: admin.role,
        },
      };
    });
  }

  // Metodat e tjera (findAll, findOne, findBySlug, update, remove) mbeten plotësisht TË NJËJTA...
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

  async update(id: string, dto: UpdateTenantDto) {
    const tenant = await this.prisma.tenant.update({
      where: { id },
      data: dto,
      select: { id: true, name: true, slug: true },
    });

    return tenant;
  }

  async remove(id: string) {
    await this.prisma.user.deleteMany({
      where: { tenantId: id },
    });

    await this.prisma.tenant.delete({
      where: { id },
    });

    return { message: 'Tenant deleted successfully', tenantId: id };
  }
}
