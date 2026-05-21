import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { BaseCrudService } from '../../common/services/base-crud.service.js';

import { CreateBookingDto } from './dto/create-booking.dto.js';
import { UpdateBookingDto } from './dto/update-booking.dto.js';

@Injectable()
export class BookingsService extends BaseCrudService<
  any,
  CreateBookingDto,
  UpdateBookingDto
> {
  constructor(protected prismaService: PrismaService) {
    super(prismaService, {
      modelName: 'booking',

      // BONUS: relations si hotels/rooms/flights/destination
      defaultInclude: {
        destination: true,
        hotel: true,
        room: true,
        flight: true,
      },
    });
  }
}
