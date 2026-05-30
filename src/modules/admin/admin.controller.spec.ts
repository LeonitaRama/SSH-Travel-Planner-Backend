// src/modules/admin/admin.controller.spec.ts
import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller.js';
import { AdminService } from './admin.service.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { AuthGuard } from '@nestjs/passport';

jest.mock('@nestjs/passport', () => ({
  AuthGuard: jest.fn().mockImplementation(() => ({ canActivate: () => true })),
}));

describe('AdminController', () => {
  let controller: AdminController;
  let adminService: jest.Mocked<AdminService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: {
            getGlobalStats: jest.fn(),
            getStatsForTenant: jest.fn(), // ✅ Fixed: Match actual service method used in controller
            getBookingTrend: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AdminController>(AdminController);
    adminService = module.get(AdminService) as jest.Mocked<AdminService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getGlobalStats', () => {
    it('should return global stats', async () => {
      const stats = {
        totalUsers: 10,
        totalTenants: 2,
        totalBookings: 100,
        activeBookings: 50,
        cancelledBookings: 10,
        totalRevenue: 5000,
      };
      adminService.getGlobalStats.mockResolvedValue(stats as any);
      const result = await controller.getGlobalStats();
      expect(adminService.getGlobalStats).toHaveBeenCalled();
      expect(result).toEqual(stats);
    });
  });
  describe('getTenantStats', () => {
    it('should return stats for a specific tenant', async () => {
      const stats = {
        tenantId: '1',
        users: 5,
        bookings: 20,
        destinations: 3,
        revenue: 2000,
      };

      const mockRequest = {
        headers: {
          'x-tenant-id': '1',
        },
      } as any;

      (adminService as any).getStatsForTenant.mockResolvedValue(stats);

      const result = await controller.getTenantStats(mockRequest);

      expect(adminService.getStatsForTenant).toHaveBeenCalledWith('1');
      expect(result).toEqual(stats);
    });
  });

  describe('getBookingTrend', () => {
    it('should return booking trend', async () => {
      const trend = [{ createdAt: new Date(), status: 'CONFIRMED' }];
      adminService.getBookingTrend.mockResolvedValue(trend as any);
      const result = await controller.getBookingTrend();
      expect(adminService.getBookingTrend).toHaveBeenCalled();
      expect(result).toEqual(trend);
    });
  });
});
