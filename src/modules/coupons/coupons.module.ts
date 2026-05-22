import { Module } from '@nestjs/common';
import { CouponsService } from './coupons.service.js';
import { CouponsController } from './coupons.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [CouponsController],
  providers: [CouponsService],
  exports: [CouponsService],
})
export class CouponsModule {}
