import { Module } from '@nestjs/common';
import { AirportsService } from './airports.service.js';
import { AirportsController } from './airports.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [AirportsController],
  providers: [AirportsService],
  exports: [AirportsService],
})
export class AirportsModule {}
