import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';
import { Role } from '../../common/enums/role.enum.js';
import { ForbiddenException } from '@nestjs/common';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { TenantGuard } from '../../common/guards/tenant.guard.js';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<UsersService>;

  const tenantId = 'tenant-123';
  const mockReq = (userId: string, role: Role) => ({
    user: { sub: userId, role },
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAllByTenant: jest.fn(),
            findOne: jest.fn(),
            findReviewsByUser: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(TenantGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService) as jest.Mocked<UsersService>;
  });

  afterEach(() => jest.clearAllMocks());

  describe('findAll', () => {
    it('should return all users for the tenant', async () => {
      const expected = [{ id: '1', email: 'test@example.com' }];
      // Use 'as any' because the mock doesn't need full user objects
      usersService.findAllByTenant.mockResolvedValue(expected as any);

      const result = await controller.findAll(tenantId);

      expect(usersService.findAllByTenant).toHaveBeenCalledWith(tenantId);
      expect(result).toEqual(expected);
    });
  });

  describe('getProfile', () => {
    it('should return the current user profile', async () => {
      const req = mockReq('user-123', Role.CUSTOMER);
      const profile = { id: 'user-123', email: 'me@example.com' };
      usersService.findOne.mockResolvedValue(profile as any);

      const result = await controller.getProfile(tenantId, req);

      expect(usersService.findOne).toHaveBeenCalledWith(tenantId, 'user-123');
      expect(result).toEqual(profile);
    });
  });

  describe('findOne', () => {
    it('should allow a user to view their own profile', async () => {
      const req = mockReq('user-123', Role.CUSTOMER);
      const user = { id: 'user-123', email: 'owner@example.com' };
      usersService.findOne.mockResolvedValue(user as any);

      const result = await controller.findOne(tenantId, 'user-123', req);

      expect(result).toEqual(user);
    });

    it('should allow an admin to view any user', async () => {
      const req = mockReq('admin-456', Role.ADMIN);
      const user = { id: 'user-123', email: 'target@example.com' };
      usersService.findOne.mockResolvedValue(user as any);

      const result = await controller.findOne(tenantId, 'user-123', req);

      expect(result).toEqual(user);
    });

    it('should forbid a customer from viewing another user', async () => {
      const req = mockReq('user-123', Role.CUSTOMER);
      await expect(
        controller.findOne(tenantId, 'other-user', req),
      ).rejects.toThrow(ForbiddenException);
      expect(usersService.findOne).not.toHaveBeenCalled();
    });
  });

  describe('getReviewsByUser', () => {
    it('should return reviews for the authenticated user', async () => {
      const req = mockReq('user-123', Role.CUSTOMER);
      const reviews = [{ id: 'rev1', comment: 'Great!' }];
      usersService.findReviewsByUser.mockResolvedValue(reviews as any);

      const result = await controller.getReviewsByUser(
        tenantId,
        'user-123',
        req,
      );

      expect(result).toEqual(reviews);
    });

    it('should forbid a customer from viewing another user’s reviews', async () => {
      const req = mockReq('user-123', Role.CUSTOMER);
      await expect(
        controller.getReviewsByUser(tenantId, 'other-user', req),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('create', () => {
    it('should create a new user (admin only)', async () => {
      const dto = {
        email: 'new@example.com',
        password: 'secret',
        role: Role.STAFF,
      };
      const created = { id: 'new-123', ...dto };
      usersService.create.mockResolvedValue(created as any);

      const result = await controller.create(tenantId, dto);

      expect(usersService.create).toHaveBeenCalledWith(tenantId, dto);
      expect(result).toEqual(created);
    });
  });

  describe('update', () => {
    it('should allow a user to update their own profile', async () => {
      const req = mockReq('user-123', Role.CUSTOMER);
      const dto = { email: 'updated@example.com' };
      const updated = { id: 'user-123', ...dto };
      usersService.update.mockResolvedValue(updated as any);

      const result = await controller.update(tenantId, 'user-123', dto, req);

      expect(usersService.update).toHaveBeenCalledWith(
        tenantId,
        'user-123',
        dto,
      );
      expect(result).toEqual(updated);
    });

    it('should allow an admin to update any user', async () => {
      const req = mockReq('admin-456', Role.ADMIN);
      const dto = { role: Role.STAFF };
      const updated = { id: 'user-123', ...dto };
      usersService.update.mockResolvedValue(updated as any);

      const result = await controller.update(tenantId, 'user-123', dto, req);

      expect(usersService.update).toHaveBeenCalledWith(
        tenantId,
        'user-123',
        dto,
      );
      expect(result).toEqual(updated);
    });

    it('should forbid a non‑admin from changing roles', async () => {
      const req = mockReq('user-123', Role.CUSTOMER);
      const dto = { role: Role.STAFF };
      await expect(
        controller.update(tenantId, 'user-123', dto, req),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should delete a user (admin only)', async () => {
      const result = { id: 'user-123', message: 'user deleted successfully' };
      usersService.remove.mockResolvedValue(result as any);

      const response = await controller.remove(tenantId, 'user-123');

      expect(usersService.remove).toHaveBeenCalledWith(tenantId, 'user-123');
      expect(response).toEqual(result);
    });
  });
});
// import { Test, TestingModule } from '@nestjs/testing';
// import { UsersController } from './users.controller.js';
// import { UsersService } from './users.service.js';
// import { Role } from '../../common/enums/role.enum.js';
// import { ForbiddenException } from '@nestjs/common';
// import { RolesGuard } from '../../common/guards/roles.guard.js';
// import { TenantGuard } from '../../common/guards/tenant.guard.js';

// describe('UsersController', () => {
//   let controller: UsersController;
//   let usersService: jest.Mocked<UsersService>;

//   const tenantId = 'tenant-123';
//   const mockReq = (userId: string, role: Role) => ({
//     user: { sub: userId, role },
//   });

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [UsersController],
//       providers: [
//         {
//           provide: UsersService,
//           useValue: {
//             findAllByTenant: jest.fn(),
//             findOne: jest.fn(),
//             findReviewsByUser: jest.fn(),
//             create: jest.fn(),
//             update: jest.fn(),
//             remove: jest.fn(),
//           },
//         },
//       ],
//     })
//       .overrideGuard(RolesGuard)
//       .useValue({ canActivate: () => true })
//       .overrideGuard(TenantGuard)
//       .useValue({ canActivate: () => true })
//       .compile();

//     controller = module.get<UsersController>(UsersController);
//     usersService = module.get(UsersService) as jest.Mocked<UsersService>;
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('findAll', () => {
//     it('should return all users for the tenant', async () => {
//       const expected = [{ id: '1', email: 'test@example.com' }];
//       usersService.findAllByTenant.mockResolvedValue(expected);

//       const result = await controller.findAll(tenantId);

//       expect(usersService.findAllByTenant).toHaveBeenCalledWith(tenantId);
//       expect(result).toEqual(expected);
//     });
//   });

//   describe('getProfile', () => {
//     it('should return the current user profile', async () => {
//       const req = mockReq('user-123', Role.CUSTOMER);
//       const profile = { id: 'user-123', email: 'me@example.com' };
//       usersService.findOne.mockResolvedValue(profile);

//       const result = await controller.getProfile(tenantId, req);

//       expect(usersService.findOne).toHaveBeenCalledWith(tenantId, 'user-123');
//       expect(result).toEqual(profile);
//     });
//   });

//   describe('findOne', () => {
//     it('should allow a user to view their own profile', async () => {
//       const req = mockReq('user-123', Role.CUSTOMER);
//       const user = { id: 'user-123', email: 'owner@example.com' };
//       usersService.findOne.mockResolvedValue(user);

//       const result = await controller.findOne(tenantId, 'user-123', req);

//       expect(result).toEqual(user);
//     });

//     it('should allow an admin to view any user', async () => {
//       const req = mockReq('admin-456', Role.ADMIN);
//       const user = { id: 'user-123', email: 'target@example.com' };
//       usersService.findOne.mockResolvedValue(user);

//       const result = await controller.findOne(tenantId, 'user-123', req);

//       expect(result).toEqual(user);
//     });

//     it('should forbid a customer from viewing another user', async () => {
//       const req = mockReq('user-123', Role.CUSTOMER);
//       await expect(
//         controller.findOne(tenantId, 'other-user', req),
//       ).rejects.toThrow(ForbiddenException);
//       expect(usersService.findOne).not.toHaveBeenCalled();
//     });
//   });

//   describe('getReviewsByUser', () => {
//     it('should return reviews for the authenticated user', async () => {
//       const req = mockReq('user-123', Role.CUSTOMER);
//       const reviews = [{ id: 'rev1', comment: 'Great!' }];
//       usersService.findReviewsByUser.mockResolvedValue(reviews);

//       const result = await controller.getReviewsByUser(
//         tenantId,
//         'user-123',
//         req,
//       );

//       expect(result).toEqual(reviews);
//     });

//     it('should forbid a customer from viewing another user’s reviews', async () => {
//       const req = mockReq('user-123', Role.CUSTOMER);
//       await expect(
//         controller.getReviewsByUser(tenantId, 'other-user', req),
//       ).rejects.toThrow(ForbiddenException);
//     });
//   });

//   describe('create', () => {
//     it('should create a new user (admin only)', async () => {
//       const dto = {
//         email: 'new@example.com',
//         password: 'secret',
//         role: Role.STAFF,
//       };
//       const created = { id: 'new-123', ...dto };
//       usersService.create.mockResolvedValue(created);

//       const result = await controller.create(tenantId, dto);

//       expect(usersService.create).toHaveBeenCalledWith(tenantId, dto);
//       expect(result).toEqual(created);
//     });
//   });

//   describe('update', () => {
//     it('should allow a user to update their own profile', async () => {
//       const req = mockReq('user-123', Role.CUSTOMER);
//       const dto = { email: 'updated@example.com' };
//       const updated = { id: 'user-123', ...dto };
//       usersService.update.mockResolvedValue(updated);

//       const result = await controller.update(tenantId, 'user-123', dto, req);

//       expect(usersService.update).toHaveBeenCalledWith(
//         tenantId,
//         'user-123',
//         dto,
//       );
//       expect(result).toEqual(updated);
//     });

//     it('should allow an admin to update any user', async () => {
//       const req = mockReq('admin-456', Role.ADMIN);
//       const dto = { role: Role.STAFF };
//       const updated = { id: 'user-123', ...dto };
//       usersService.update.mockResolvedValue(updated);

//       const result = await controller.update(tenantId, 'user-123', dto, req);

//       expect(usersService.update).toHaveBeenCalledWith(
//         tenantId,
//         'user-123',
//         dto,
//       );
//       expect(result).toEqual(updated);
//     });

//     it('should forbid a non‑admin from changing roles', async () => {
//       const req = mockReq('user-123', Role.CUSTOMER);
//       const dto = { role: Role.STAFF };
//       await expect(
//         controller.update(tenantId, 'user-123', dto, req),
//       ).rejects.toThrow(ForbiddenException);
//     });
//   });

//   describe('remove', () => {
//     it('should delete a user (admin only)', async () => {
//       const result = { id: 'user-123', message: 'user deleted successfully' };
//       usersService.remove.mockResolvedValue(result);

//       const response = await controller.remove(tenantId, 'user-123');

//       expect(usersService.remove).toHaveBeenCalledWith(tenantId, 'user-123');
//       expect(response).toEqual(result);
//     });
//   });
// });
