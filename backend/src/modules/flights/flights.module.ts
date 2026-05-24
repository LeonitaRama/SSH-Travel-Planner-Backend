import { Module } from '@nestjs/common';

import { FlightsService } from './flights.service.js';
import { FlightsController } from './flights.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [FlightsController],
  providers: [FlightsService],
  exports: [FlightsService],
})
export class FlightsModule {}
