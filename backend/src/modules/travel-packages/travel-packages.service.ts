import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { BaseCrudService } from '../../common/services/base-crud.service.js';
import { CreateTravelPackageDto } from './dto/create-travel-package.dto.js';
import { UpdateTravelPackageDto } from './dto/update-travel-package.dto.js';
import { TravelPackage } from '@prisma/client';

@Injectable()
export class TravelPackagesService extends BaseCrudService<
  TravelPackage,
  CreateTravelPackageDto,
  UpdateTravelPackageDto
> {
  constructor(protected prismaService: PrismaService) {
    super(prismaService, {
      modelName: 'travelPackage',
      defaultInclude: {
        destination: true,
      },
    });
  }

  async addHotelToPackage(
    tenantId: string,
    packageId: string,
    hotelId: string,
  ) {
    return this.prismaService.travelPackage.update({
      where: { id: packageId, tenantId },
      data: {
        hotels: {
          connect: { id: hotelId },
        },
      },
    });
  }

  async removeHotelFromPackage(
    tenantId: string,
    packageId: string,
    hotelId: string,
  ) {
    return this.prismaService.travelPackage.update({
      where: { id: packageId, tenantId },
      data: {
        hotels: {
          disconnect: { id: hotelId },
        },
      },
    });
  }

  async addFlightToPackage(
    tenantId: string,
    packageId: string,
    flightId: string,
  ) {
    return this.prismaService.travelPackage.update({
      where: { id: packageId, tenantId },
      data: {
        flights: {
          connect: { id: flightId },
        },
      },
    });
  }

  async removeFlightFromPackage(
    tenantId: string,
    packageId: string,
    flightId: string,
  ) {
    return this.prismaService.travelPackage.update({
      where: { id: packageId, tenantId },
      data: {
        flights: {
          disconnect: { id: flightId },
        },
      },
    });
  }
}
