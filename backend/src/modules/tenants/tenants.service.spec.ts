import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { TenantsService } from './tenants.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { ConflictException, NotFoundException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { Role } from '../../common/enums/role.enum.js';

const mockPrismaService = {
  tenant: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  user: {
    findFirst: jest.fn(),
    create: jest.fn(),
    deleteMany: jest.fn(),
  },
  $transaction: jest
    .fn()
    .mockImplementation((callback: any) => callback(mockPrismaService)),
} as any;

describe('TenantsService', () => {
  let service: TenantsService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();
    service = module.get<TenantsService>(TenantsService);
    prisma = module.get(PrismaService) as typeof mockPrismaService;
  });

  describe('create', () => {
    const dto = {
      name: 'New Tenant',
      slug: 'new-tenant',
      adminEmail: 'admin@example.com',
      adminPassword: 'password123',
      adminUsername: 'adminuser',
    };

    it('should throw ConflictException if slug exists', async () => {
      prisma.tenant.findUnique.mockResolvedValue({ id: '1', slug: dto.slug });
      await expect(service.create(dto as any)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw ConflictException if admin email exists', async () => {
      prisma.tenant.findUnique.mockResolvedValue(null);
      prisma.user.findFirst.mockResolvedValue({
        id: '2',
        email: dto.adminEmail,
      });
      await expect(service.create(dto as any)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should create tenant and admin in transaction', async () => {
      prisma.tenant.findUnique.mockResolvedValue(null);
      prisma.user.findFirst.mockResolvedValue(null);
      const hashedPassword = await bcrypt.hash(dto.adminPassword, 10);

      const tenant = {
        id: 'tenant1',
        name: dto.name,
        slug: dto.slug,
        createdAt: new Date(),
      };
      const admin = {
        id: 'admin1',
        username: dto.adminUsername,
        email: dto.adminEmail,
        password: hashedPassword,
        role: Role.ADMIN,
      };

      prisma.tenant.create.mockResolvedValue(tenant);
      prisma.user.create.mockResolvedValue(admin);

      const result = await service.create(dto as any);

      expect(prisma.tenant.create).toHaveBeenCalledWith({
        data: { name: dto.name, slug: dto.slug },
      });
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          username: dto.adminUsername,
          email: dto.adminEmail,
          password: expect.stringMatching(/^\$2[aby]\$\d+\$.*/),
          tenantId: tenant.id,
          role: Role.ADMIN,
        },
      });
      expect(result).toEqual({
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
      });
    });
  });

  describe('findAll', () => {
    it('should return all tenants with user count', async () => {
      const tenants = [
        {
          id: '1',
          name: 'A',
          slug: 'a',
          createdAt: new Date(),
          _count: { users: 5 },
        },
      ];
      prisma.tenant.findMany.mockResolvedValue(tenants);
      const result = await service.findAll();
      expect(prisma.tenant.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          name: true,
          slug: true,
          createdAt: true,
          _count: { select: { users: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(tenants);
    });
  });

  describe('findOne', () => {
    it('should return tenant with users', async () => {
      const tenant = { id: '1', name: 'Test', slug: 'test', users: [] };
      prisma.tenant.findUnique.mockResolvedValue(tenant);
      const result = await service.findOne('1');
      expect(prisma.tenant.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          users: {
            select: { id: true, email: true, role: true, createdAt: true },
          },
        },
      });
      expect(result).toEqual(tenant);
    });

    it('should throw NotFoundException if tenant not found', async () => {
      prisma.tenant.findUnique.mockResolvedValue(null);
      await expect(service.findOne('404')).rejects.toThrow(NotFoundException);
    });
    // it('should throw NotFoundException if tenant not found', async () => {
    //   prisma.tenant.findUnique.mockResolvedValue(null);
    //   const result = await service.findOne('404'); // kjo hedh përjashtim, por testi nuk pret asgjë
    //   expect(result).toBeDefined(); // dështon sepse nuk arrin këtu
    // });
  });

  describe('findBySlug', () => {
    it('should return tenant by slug', async () => {
      const tenant = {
        id: '1',
        name: 'Test',
        slug: 'test',
        createdAt: new Date(),
      };
      prisma.tenant.findUnique.mockResolvedValue(tenant);
      const result = await service.findBySlug('test');
      expect(prisma.tenant.findUnique).toHaveBeenCalledWith({
        where: { slug: 'test' },
        select: { id: true, name: true, slug: true, createdAt: true },
      });
      expect(result).toEqual(tenant);
    });

    it('should throw NotFoundException if slug not found', async () => {
      prisma.tenant.findUnique.mockResolvedValue(null);
      await expect(service.findBySlug('unknown')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update tenant', async () => {
      const dto = { name: 'Updated' };
      const updated = { id: '1', name: 'Updated', slug: 'test' };
      prisma.tenant.update.mockResolvedValue(updated);
      const result = await service.update('1', dto);
      expect(prisma.tenant.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: dto,
        select: { id: true, name: true, slug: true },
      });
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should delete all users and then the tenant', async () => {
      prisma.user.deleteMany.mockResolvedValue({ count: 3 });
      prisma.tenant.delete.mockResolvedValue({ id: '1' });
      const result = await service.remove('1');
      expect(prisma.user.deleteMany).toHaveBeenCalledWith({
        where: { tenantId: '1' },
      });
      expect(prisma.tenant.delete).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual({
        message: 'Tenant deleted successfully',
        tenantId: '1',
      });
    });
  });
});
