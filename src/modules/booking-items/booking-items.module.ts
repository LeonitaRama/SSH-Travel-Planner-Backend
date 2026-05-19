import { Module } from '@nestjs/common';

import { BookingItemsService } from './booking-items.service.js';
import { BookingItemsController } from './booking-items.controller.js';

import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [BookingItemsController],
  providers: [BookingItemsService],
  exports: [BookingItemsService],
})
export class BookingItemsModule {}
