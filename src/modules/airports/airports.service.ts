import { Injectable, NotFoundException } from '@nestjs/common';
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
  constructor(protected prismaService: PrismaService) {
    super(prismaService, {
      modelName: 'airport',
    });
  }

  async findDepartures(tenantId: string, airportId: string) {
    const airport = await this.prismaService.airport.findFirst({
      where: { id: airportId, tenantId },
    });
    if (!airport) throw new NotFoundException('Airport not found');

    return this.prismaService.flight.findMany({
      where: { tenantId, departureCity: airport.city },
    });
  }

  async findArrivals(tenantId: string, airportId: string) {
    const airport = await this.prismaService.airport.findFirst({
      where: { id: airportId, tenantId },
    });
    if (!airport) throw new NotFoundException('Airport not found');

    return this.prismaService.flight.findMany({
      where: { tenantId, arrivalCity: airport.city },
    });
  }
}
