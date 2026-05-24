import { Module } from '@nestjs/common';
import { AirlinesService } from './airlines.service.js';
import { AirlinesController } from './airlines.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [AirlinesController],
  providers: [AirlinesService],
  exports: [AirlinesService],
})
export class AirlinesModule {}