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
      modelName: 'hotel', // Sigurohuni që përputhet me schema.prisma
      defaultInclude: { destination: true }, // Gjithmonë merr edhe destination-in e lidhur
    });
  }

  // Metodë specifike për të gjetur hotelet sipas destination
  async findByDestination(tenantId: string, destinationId: string) {
    return this.prismaService.hotel.findMany({
      where: {
        tenantId,
        destinationId,
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
