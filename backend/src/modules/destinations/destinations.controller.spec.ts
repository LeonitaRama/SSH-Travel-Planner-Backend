import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { DestinationsController } from './destinations.controller.js';
import { DestinationsService } from './destinations.service.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { TenantGuard } from '../../common/guards/tenant.guard.js';
import { AuthGuard } from '@nestjs/passport';

// Mock the guards
jest.mock('@nestjs/passport', () => ({
  AuthGuard: jest.fn().mockImplementation(() => ({ canActivate: () => true })),
}));

describe('DestinationsController', () => {
  let controller: DestinationsController;
  let destinationsService: jest.Mocked<DestinationsService>;

  const tenantId = 'tenant-123';
  const destinationId = 'dest-456';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DestinationsController],
      providers: [
        {
          provide: DestinationsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            findHotelsByDestination: jest.fn(),
            findFlightsByDestination: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(TenantGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<DestinationsController>(DestinationsController);
    destinationsService = module.get(DestinationsService) as jest.Mocked<DestinationsService>;
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should create a destination (ADMIN/STAFF)', async () => {
      const dto = { name: 'Paris', description: 'City of light' };
      const created = { id: destinationId, ...dto };
      destinationsService.create.mockResolvedValue(created as any);

      const result = await controller.create(tenantId, dto as any);
      expect(destinationsService.create).toHaveBeenCalledWith(tenantId, dto);
      expect(result).toEqual(created);
    });
  });

  describe('findAll', () => {
    it('should return all destinations for tenant', async () => {
      const destinations = [{ id: '1', name: 'Paris' }];
      destinationsService.findAll.mockResolvedValue(destinations as any);
      const result = await controller.findAll(tenantId);
      expect(destinationsService.findAll).toHaveBeenCalledWith(tenantId);
      expect(result).toEqual(destinations);
    });
  });

  describe('findOne', () => {
    it('should return a destination by id', async () => {
      const destination = { id: destinationId, name: 'Paris' };
      destinationsService.findOne.mockResolvedValue(destination as any);
      const result = await controller.findOne(tenantId, destinationId);
      expect(destinationsService.findOne).toHaveBeenCalledWith(tenantId, destinationId);
      expect(result).toEqual(destination);
    });
  });

  describe('update', () => {
    it('should update a destination', async () => {
      const dto = { name: 'London' };
      const updated = { id: destinationId, ...dto };
      destinationsService.update.mockResolvedValue(updated as any);
      const result = await controller.update(tenantId, destinationId, dto as any);
      expect(destinationsService.update).toHaveBeenCalledWith(tenantId, destinationId, dto);
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should delete a destination (ADMIN only)', async () => {
      const deleted = { id: destinationId, message: 'deleted' };
      destinationsService.remove.mockResolvedValue(deleted as any);
      const result = await controller.remove(tenantId, destinationId);
      expect(destinationsService.remove).toHaveBeenCalledWith(tenantId, destinationId);
      expect(result).toEqual(deleted);
    });
  });

  describe('getHotelsByDestination', () => {
    it('should return hotels for a destination', async () => {
      const hotels = [{ id: 'hotel1', name: 'Hotel A' }];
      destinationsService.findHotelsByDestination.mockResolvedValue(hotels as any);
      const result = await controller.getHotelsByDestination(tenantId, destinationId);
      expect(destinationsService.findHotelsByDestination).toHaveBeenCalledWith(tenantId, destinationId);
      expect(result).toEqual(hotels);
    });
  });

  describe('getFlightsByDestination', () => {
    it('should return flights for a destination', async () => {
      const flights = [{ id: 'flight1', code: 'AF123' }];
      destinationsService.findFlightsByDestination.mockResolvedValue(flights as any);
      const result = await controller.getFlightsByDestination(tenantId, destinationId);
      expect(destinationsService.findFlightsByDestination).toHaveBeenCalledWith(tenantId, destinationId);
      expect(result).toEqual(flights);
    });
  });
});