import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { TenantsController } from './tenants.controller.js';
import { TenantsService } from './tenants.service.js';
import { Role } from '../../common/enums/role.enum.js';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard.js';

// Mock the guards
jest.mock('@nestjs/passport', () => ({
  AuthGuard: jest.fn().mockImplementation(() => ({ canActivate: () => true })),
}));

describe('TenantsController', () => {
  let controller: TenantsController;
  let tenantsService: jest.Mocked<TenantsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantsController],
      providers: [
        {
          provide: TenantsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            findBySlug: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<TenantsController>(TenantsController);
    tenantsService = module.get(TenantsService) as jest.Mocked<TenantsService>;
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should create a new tenant (super admin only)', async () => {
      const dto = {
        name: 'Test Tenant',
        slug: 'test-tenant',
        adminEmail: 'admin@test.com',
        adminPassword: 'secret',
        adminUsername: 'admin',
      };
      const result = {
        message: 'Tenant and Admin created successfully',
        tenant: { id: '1', name: dto.name, slug: dto.slug },
        admin: {
          id: '2',
          username: dto.adminUsername,
          email: dto.adminEmail,
          role: Role.ADMIN,
        },
      };
      tenantsService.create.mockResolvedValue(result as any);

      const response = await controller.create(dto as any);
      expect(tenantsService.create).toHaveBeenCalledWith(dto);
      expect(response).toEqual(result);
    });
  });

  describe('findAll', () => {
    it('should return all tenants (super admin only)', async () => {
      const tenants = [
        {
          id: '1',
          name: 'Tenant A',
          slug: 'a',
          createdAt: new Date(),
          _count: { users: 2 },
        },
      ];
      tenantsService.findAll.mockResolvedValue(tenants as any);
      const result = await controller.findAll();
      expect(tenantsService.findAll).toHaveBeenCalled();
      expect(result).toEqual(tenants);
    });
  });

  describe('findOne', () => {
    it('should return a tenant by id', async () => {
      const tenant = { id: '1', name: 'Test', slug: 'test', users: [] };
      tenantsService.findOne.mockResolvedValue(tenant as any);
      const result = await controller.findOne('1');
      expect(tenantsService.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(tenant);
    });
  });

  describe('findBySlug', () => {
    it('should return a tenant by slug (public)', async () => {
      const tenant = {
        id: '1',
        name: 'Test',
        slug: 'test',
        createdAt: new Date(),
      };
      tenantsService.findBySlug.mockResolvedValue(tenant as any);
      const result = await controller.findBySlug('test');
      expect(tenantsService.findBySlug).toHaveBeenCalledWith('test');
      expect(result).toEqual(tenant);
    });
  });

  describe('update', () => {
    it('should update a tenant', async () => {
      const dto = { name: 'Updated Name' };
      const updated = { id: '1', name: 'Updated Name', slug: 'test' };
      tenantsService.update.mockResolvedValue(updated as any);
      const result = await controller.update('1', dto as any);
      expect(tenantsService.update).toHaveBeenCalledWith('1', dto);
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should delete a tenant', async () => {
      const result = { message: 'Tenant deleted successfully', tenantId: '1' };
      tenantsService.remove.mockResolvedValue(result as any);
      const response = await controller.remove('1');
      expect(tenantsService.remove).toHaveBeenCalledWith('1');
      expect(response).toEqual(result);
    });
  });
});
