import { Module } from '@nestjs/common';

import { BookingsService } from './bookings.service.js';
import { BookingsController } from './bookings.controller.js';

import { PrismaModule } from '../prisma/prisma.module.js';
import { BackgroundJobsModule } from '../background-jobs/background-jobs.module.js';
@Module({
  imports: [PrismaModule, BackgroundJobsModule],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
