import { Injectable, BadRequestException } from '@nestjs/common';
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

  async findByDestination(tenantId: string, destinationId: string) {
    return this.prismaService.hotel.findMany({
      where: { tenantId, destinationId },
      include: { destination: true },
    });
  }

  async create(tenantId: string, dto: CreateHotelDto) {
    const destination = await this.prismaService.destination.findFirst({
      where: { id: dto.destinationId, tenantId },
    });

    if (!destination) {
      throw new BadRequestException('Destination not found in this tenant');
    }

    return super.create(tenantId, dto);
  }

  async findRoomsByHotel(tenantId: string, hotelId: string) {
    return this.prismaService.room.findMany({
      where: { hotelId, tenantId },
    });
  }

  async findReviewsByHotel(tenantId: string, hotelId: string) {
    return this.prismaService.review.findMany({
      where: { hotelId, tenantId },
    });
  }
}
