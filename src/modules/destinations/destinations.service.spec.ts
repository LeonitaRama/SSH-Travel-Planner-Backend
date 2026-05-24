import { jest } from '@jest/globals';
// src/modules/destinations/destinations.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { DestinationsService } from './destinations.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { NotFoundException } from '@nestjs/common';

// Use `any` to bypass strict TypeScript checking for mocks
const mockPrismaService = {
  hotel: { findMany: jest.fn() },
  destination: { findFirst: jest.fn() },
  flight: { findMany: jest.fn() },
} as any;

const mockCacheManager = {
  get: jest.fn(),
  set: jest.fn(),
};

describe('DestinationsService', () => {
  let service: DestinationsService;
  let prisma: any;
  let cache: any;

  const tenantId = 'tenant-123';
  const destinationId = 'dest-456';

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DestinationsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
      ],
    }).compile();
    service = module.get<DestinationsService>(DestinationsService);
    prisma = module.get(PrismaService);
    cache = module.get(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findHotelsByDestination', () => {
    it('should fetch hotels from DB and cache them if not cached', async () => {
      cache.get.mockResolvedValue(null);
      const hotels = [{ id: 'h1', name: 'Hotel A' }];
      prisma.hotel.findMany.mockResolvedValue(hotels);
      const result = await service.findHotelsByDestination(
        tenantId,
        destinationId,
      );
      expect(prisma.hotel.findMany).toHaveBeenCalledWith({
        where: { tenantId, destinationId },
      });
      expect(cache.set).toHaveBeenCalledWith(
        `dest-hotels-${tenantId}-${destinationId}`,
        hotels,
        60000,
      );
      expect(result).toEqual(hotels);
    });
  });

  describe('findFlightsByDestination', () => {
    it('should throw NotFoundException if destination not found', async () => {
      cache.get.mockResolvedValue(null);
      prisma.destination.findFirst.mockResolvedValue(null);
      await expect(
        service.findFlightsByDestination(tenantId, destinationId),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
