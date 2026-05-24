import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

const mockPrismaService = {
  user: { count: jest.fn() },
  tenant: { count: jest.fn() },
  booking: {
    count: jest.fn(),
    findMany: jest.fn(),
  },
  payment: { aggregate: jest.fn() },
  destination: { count: jest.fn() },
} as any;

describe('AdminService', () => {
  let service: AdminService;
  let prisma: any;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();
    service = module.get<AdminService>(AdminService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getGlobalStats', () => {
    it('should return aggregated global stats', async () => {
      prisma.user.count.mockResolvedValue(100);
      prisma.tenant.count.mockResolvedValue(5);
      // The service calls booking.count three times:
      // 1. totalBookings (no where)
      // 2. activeBookings (where status: 'CONFIRMED')
      // 3. cancelledBookings (where status: 'CANCELLED')
      prisma.booking.count
        .mockResolvedValueOnce(500) // total
        .mockResolvedValueOnce(300) // active
        .mockResolvedValueOnce(50); // cancelled
      prisma.payment.aggregate.mockResolvedValue({ _sum: { amount: 10000 } });

      const result = await service.getGlobalStats();
      expect(result).toEqual({
        totalUsers: 100,
        totalTenants: 5,
        totalBookings: 500,
        activeBookings: 300,
        cancelledBookings: 50,
        totalRevenue: 10000,
      });
    });
  });

  describe('getTenantStats', () => {
    it('should return stats for a given tenant', async () => {
      prisma.user.count.mockResolvedValue(10);
      prisma.booking.count.mockResolvedValue(40);
      prisma.payment.aggregate.mockResolvedValue({ _sum: { amount: 2000 } });
      prisma.destination.count.mockResolvedValue(4);

      const result = await service.getTenantStats('tenant-1');
      expect(result).toEqual({
        tenantId: 'tenant-1',
        users: 10,
        bookings: 40,
        destinations: 4,
        revenue: 2000,
      });
    });
  });

  describe('getBookingTrend', () => {
    it('should return bookings for all tenants if no tenantId', async () => {
      const bookings = [{ createdAt: new Date(), status: 'CONFIRMED' }];
      prisma.booking.findMany.mockResolvedValue(bookings);
      const result = await service.getBookingTrend();
      expect(prisma.booking.findMany).toHaveBeenCalledWith({
        where: {},
        select: { createdAt: true, status: true },
      });
      expect(result).toEqual(bookings);
    });

    it('should return bookings for a specific tenant if tenantId provided', async () => {
      const bookings = [{ createdAt: new Date(), status: 'CONFIRMED' }];
      prisma.booking.findMany.mockResolvedValue(bookings);
      const result = await service.getBookingTrend('tenant-1');
      expect(prisma.booking.findMany).toHaveBeenCalledWith({
        where: { tenantId: 'tenant-1' },
        select: { createdAt: true, status: true },
      });
      expect(result).toEqual(bookings);
    });
  });
});
// import { Test, TestingModule } from '@nestjs/testing';
// import { AdminService } from './admin.service.js';
// import { PrismaService } from '../prisma/prisma.service.js';

// const mockPrismaService = {
//   user: { count: jest.fn() },
//   tenant: { count: jest.fn() },
//   booking: { count: jest.fn() },
//   payment: { aggregate: jest.fn() },
//   destination: { count: jest.fn() },
// } as any;

// describe('AdminService', () => {
//   let service: AdminService;
//   let prisma: any;

//   beforeEach(async () => {
//     jest.clearAllMocks();
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         AdminService,
//         { provide: PrismaService, useValue: mockPrismaService },
//       ],
//     }).compile();
//     service = module.get<AdminService>(AdminService);
//     prisma = module.get(PrismaService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   describe('getGlobalStats', () => {
//     it('should return aggregated global stats', async () => {
//       prisma.user.count.mockResolvedValue(100);
//       prisma.tenant.count.mockResolvedValue(5);
//       prisma.booking.count.mockResolvedValue(500);
//       prisma.booking.count.mockResolvedValueOnce(300); // active
//       prisma.booking.count.mockResolvedValueOnce(50); // cancelled
//       prisma.payment.aggregate.mockResolvedValue({ _sum: { amount: 10000 } });

//       const result = await service.getGlobalStats();
//       expect(result).toEqual({
//         totalUsers: 100,
//         totalTenants: 5,
//         totalBookings: 500,
//         activeBookings: 300,
//         cancelledBookings: 50,
//         totalRevenue: 10000,
//       });
//     });
//   });

//   describe('getTenantStats', () => {
//     it('should return stats for a given tenant', async () => {
//       prisma.user.count.mockResolvedValue(10);
//       prisma.booking.count.mockResolvedValue(40);
//       prisma.payment.aggregate.mockResolvedValue({ _sum: { amount: 2000 } });
//       prisma.destination.count.mockResolvedValue(4);

//       const result = await service.getTenantStats('tenant-1');
//       expect(result).toEqual({
//         tenantId: 'tenant-1',
//         users: 10,
//         bookings: 40,
//         destinations: 4,
//         revenue: 2000,
//       });
//     });
//   });

//   describe('getBookingTrend', () => {
//     it('should return bookings for all tenants if no tenantId', async () => {
//       const bookings = [{ createdAt: new Date(), status: 'CONFIRMED' }];
//       prisma.booking.findMany.mockResolvedValue(bookings);
//       const result = await service.getBookingTrend();
//       expect(prisma.booking.findMany).toHaveBeenCalledWith({
//         where: {},
//         select: { createdAt: true, status: true },
//       });
//       expect(result).toEqual(bookings);
//     });
//   });
// });
