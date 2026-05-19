import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { BaseCrudService } from '../../common/services/base-crud.service.js';

import { CreateBookingItemDto } from './dto/create-booking-item.dto.js';
import { UpdateBookingItemDto } from './dto/update-booking-item.dto.js';

@Injectable()
export class BookingItemsService extends BaseCrudService<
  any,
  CreateBookingItemDto,
  UpdateBookingItemDto
> {
  constructor(protected prismaService: PrismaService) {
    super(prismaService, {
      modelName: 'BookingItem',

      // relations opsionale
      defaultInclude: {
        booking: true,
      },
    });
  }
}
