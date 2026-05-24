import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { Role } from '../../common/enums/role.enum.js';
import bcrypt from 'bcrypt';

// Use any for the mock to avoid TypeScript strictness
const mockPrismaService = {
  user: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  review: {
    findMany: jest.fn(),
  },
} as any;

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: typeof mockPrismaService;
  const tenantId = 'tenant-123';
  const userId = 'user-456';

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get(UsersService);
    prismaService = module.get(PrismaService) as typeof mockPrismaService;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should hash password and create user with default role', async () => {
      const dto = { email: 'test@example.com', password: 'plain123' };
      const hashed = await bcrypt.hash(dto.password, 10);
      const expectedCreated = {
        id: 'new-id',
        email: dto.email,
        password: hashed,
        role: Role.CUSTOMER,
        createdAt: new Date(),
      };
      prismaService.user.create.mockResolvedValue(expectedCreated);

      const result = await service.create(tenantId, dto);

      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: dto.email,
          password: expect.stringMatching(/^\$2[aby]\$\d+\$.*/),
          role: Role.CUSTOMER,
          tenantId,
        }),
        select: expect.objectContaining({
          id: true,
          email: true,
          role: true,
          createdAt: true,
        }),
      });
      expect(result).toEqual(expectedCreated);
      // expect(result).toEqual({ ...expectedCreated, id: 'wrong-id' });
    });

    it('should use provided role when given', async () => {
      const dto = {
        email: 'admin@example.com',
        password: 'admin123',
        role: Role.ADMIN,
      };
      const hashed = await bcrypt.hash(dto.password, 10);
      const expected = { id: '1', ...dto, password: hashed };
      prismaService.user.create.mockResolvedValue(expected);
      await service.create(tenantId, dto);
      expect(prismaService.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ role: Role.ADMIN }),
        }),
      );
    });
  });

  describe('update', () => {
    it('should hash new password if provided', async () => {
      const updateDto = { password: 'newPass' };
      const hashed = await bcrypt.hash('newPass', 10);
      prismaService.user.findFirst.mockResolvedValue({ id: userId, tenantId });
      prismaService.user.update.mockResolvedValue({
        id: userId,
        ...updateDto,
        password: hashed,
      });

      await service.update(tenantId, userId, updateDto);

      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: expect.objectContaining({
          password: expect.stringMatching(/^\$2[aby]\$\d+\$.*/),
        }),
        select: { id: true, email: true, role: true, createdAt: true },
      });
    });

    it('should not hash password when not provided', async () => {
      const updateDto = { email: 'new@example.com' };
      prismaService.user.findFirst.mockResolvedValue({ id: userId, tenantId });
      prismaService.user.update.mockResolvedValue({ id: userId, ...updateDto });

      await service.update(tenantId, userId, updateDto);

      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: updateDto,
        select: { id: true, email: true, role: true, createdAt: true },
      });
    });
  });

  describe('findAllByTenant', () => {
    it('should return all users for tenant', async () => {
      const users = [
        {
          id: '1',
          email: 'user1@test.com',
          role: Role.CUSTOMER,
          createdAt: new Date(),
        },
        {
          id: '2',
          email: 'user2@test.com',
          role: Role.STAFF,
          createdAt: new Date(),
        },
      ];
      prismaService.user.findMany.mockResolvedValue(users);
      const result = await service.findAllByTenant(tenantId);
      expect(prismaService.user.findMany).toHaveBeenCalledWith({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
        select: { id: true, email: true, role: true, createdAt: true },
      });
      expect(result).toEqual(users);
    });
  });

  describe('findReviewsByUser', () => {
    it('should return reviews for a specific user', async () => {
      const reviews = [
        { id: 'rev1', comment: 'Great', rating: 5 },
        { id: 'rev2', comment: 'Nice', rating: 4 },
      ];
      prismaService.review.findMany.mockResolvedValue(reviews);
      const result = await service.findReviewsByUser(tenantId, userId);
      expect(prismaService.review.findMany).toHaveBeenCalledWith({
        where: { userId, tenantId },
      });
      expect(result).toEqual(reviews);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const expected = { id: userId, message: 'user deleted successfully' };
      prismaService.user.delete.mockResolvedValue({ id: userId });
      const result = await service.remove(tenantId, userId);
      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toEqual(expected);
    });

    it('should throw an error if user does not exist', async () => {
      const error = new Error('Record to delete does not exist');
      prismaService.user.delete.mockRejectedValue(error);
      await expect(service.remove(tenantId, 'nonexistent')).rejects.toThrow(
        'Record to delete does not exist',
      );
    });
  });
});
