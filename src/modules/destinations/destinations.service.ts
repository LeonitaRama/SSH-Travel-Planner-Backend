import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { BaseCrudService } from '../../common/services/base-crud.service.js';
import { CreateDestinationDto } from './dto/create-destination.dto.js';
import { UpdateDestinationDto } from './dto/update-destination.dto.js';

@Injectable()
export class DestinationsService extends BaseCrudService<
  any,
  CreateDestinationDto,
  UpdateDestinationDto
> {
  constructor(protected prismaService: PrismaService) {
    super(prismaService, {
      modelName: 'destination',
    });
  }

  async findHotelsByDestination(tenantId: string, destinationId: string) {
    return this.prismaService.hotel.findMany({
      where: { tenantId, destinationId },
    });
  }

  async findFlightsByDestination(tenantId: string, destinationId: string) {
    const destination = await this.prismaService.destination.findFirst({
      where: { id: destinationId, tenantId },
    });
    if (!destination) throw new NotFoundException('Destination not found');

    return this.prismaService.flight.findMany({
      where: { tenantId, arrivalCity: destination.name },
    });
  }
}
