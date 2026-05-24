import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

import { PrismaService } from '../prisma/prisma.service.js';
import { BaseCrudService } from '../../common/services/base-crud.service.js';
import { CreateDestinationDto } from './dto/create-destination.dto.js';
import { UpdateDestinationDto } from './dto/update-destination.dto.js';
import { Destination } from '@prisma/client';

@Injectable()
export class DestinationsService extends BaseCrudService<
  Destination,
  CreateDestinationDto,
  UpdateDestinationDto
> {
  constructor(
    protected prismaService: PrismaService,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {
    super(prismaService, {
      modelName: 'destination',
    });
  }

  async findHotelsByDestination(tenantId: string, destinationId: string) {
    const cacheKey = `dest-hotels-${tenantId}-${destinationId}`;

    const cached = await this.cacheManager.get(cacheKey);

    if (cached) {
      console.log('Returned from cache');
      return cached;
    }

    const hotels = await this.prismaService.hotel.findMany({
      where: { tenantId, destinationId },
    });

    await this.cacheManager.set(cacheKey, hotels, 60000); // 60 sec

    return hotels;
  }

  async findFlightsByDestination(tenantId: string, destinationId: string) {
    const cacheKey = `dest-flights-${tenantId}-${destinationId}`;

    const cached = await this.cacheManager.get(cacheKey);

    if (cached) {
      console.log('Returned from cache');
      return cached;
    }

    const destination = await this.prismaService.destination.findFirst({
      where: { id: destinationId, tenantId },
    });

    if (!destination) throw new NotFoundException('Destination not found');

    const flights = await this.prismaService.flight.findMany({
      where: {
        tenantId,
        arrivalCity: destination.name,
      },
    });

    await this.cacheManager.set(cacheKey, flights, 60000);

    return flights;
  }
}
