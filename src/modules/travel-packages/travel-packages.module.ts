import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';

import { TravelPackagesService } from './travel-packages.service.js';
import { TravelPackagesController } from './travel-packages.controller.js';

@Module({
  imports: [PrismaModule],
  controllers: [TravelPackagesController],
  providers: [TravelPackagesService],
})
export class TravelPackagesModule {}
