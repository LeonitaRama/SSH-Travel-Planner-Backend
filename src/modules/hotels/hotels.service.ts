import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { BaseCrudService } from '../../common/services/base-crud.service.js';
import { CreateHotelDto } from './dto/create-hotel.dto.js';
import { UpdateHotelDto } from './dto/update-hotel.dto.js';

@Injectable()
export class HotelsService extends BaseCrudService<
  any,
  CreateHotelDto,
  UpdateHotelDto
> {
  constructor(protected prismaService: PrismaService) {
    super(prismaService, {
      modelName: 'hotel',
      defaultInclude: { destination: true },
    });
  }

  // SEARCH & FILTERING
  async findByFilters(
    tenantId: string,
    destinationId?: string,
    rating?: number,
    maxPrice?: number,
  ) {
    return this.prismaService.hotel.findMany({
      where: {
        tenantId,

        ...(destinationId && {
          destinationId,
        }),

        ...(rating && {
          rating: {
            gte: rating,
          },
        }),

        ...(maxPrice && {
          pricePerNight: {
            lte: maxPrice,
          },
        }),
      },

      include: {
        destination: true,
      },
    });
  }

  // Override nëse duam validim shtesë para krijimit
  async create(tenantId: string, dto: CreateHotelDto) {
    // Verifikojmë nëse destination ekziston
    const destination = await this.prismaService.destination.findFirst({
      where: {
        id: dto.destinationId,
        tenantId,
      },
    });

    if (!destination) {
      throw new Error('Destination not found in this tenant');
    }

    return super.create(tenantId, dto);
  }
}
