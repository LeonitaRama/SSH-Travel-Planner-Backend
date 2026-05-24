import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

import { PrismaService } from '../prisma/prisma.service.js';
import { BaseCrudService } from '../../common/services/base-crud.service.js';
import { CreateAirportDto } from './dto/create-airport.dto.js';
import { UpdateAirportDto } from './dto/update-airport.dto.js';
import { Airport } from '@prisma/client';

@Injectable()
export class AirportsService extends BaseCrudService<
  Airport,
  CreateAirportDto,
  UpdateAirportDto
> {
  constructor(
    protected prismaService: PrismaService,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {
    super(prismaService, {
      modelName: 'airport',
    });
  }

  async findDepartures(tenantId: string, airportId: string) {
    const cacheKey = `airport-departures-${tenantId}-${airportId}`;

    const cached = await this.cacheManager.get(cacheKey);

    if (cached) {
      console.log('Returned departures from cache');
      return cached;
    }

    const airport = await this.prismaService.airport.findFirst({
      where: { id: airportId, tenantId },
    });

    if (!airport) {
      throw new NotFoundException('Airport not found');
    }

    const departures = await this.prismaService.flight.findMany({
      where: {
        tenantId,
        departureCity: airport.city,
      },
    });

    await this.cacheManager.set(cacheKey, departures, 60000); // 60 sec

    return departures;
  }

  async findArrivals(tenantId: string, airportId: string) {
    const cacheKey = `airport-arrivals-${tenantId}-${airportId}`;

    const cached = await this.cacheManager.get(cacheKey);

    if (cached) {
      console.log('Returned arrivals from cache');
      return cached;
    }

    const airport = await this.prismaService.airport.findFirst({
      where: { id: airportId, tenantId },
    });

    if (!airport) {
      throw new NotFoundException('Airport not found');
    }

    const arrivals = await this.prismaService.flight.findMany({
      where: {
        tenantId,
        arrivalCity: airport.city,
      },
    });

    await this.cacheManager.set(cacheKey, arrivals, 60000); // 60 sec

    return arrivals;
  }
}
