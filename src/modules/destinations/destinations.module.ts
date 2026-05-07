import { Module } from '@nestjs/common';
import { DestinationsService } from './destinations.service.js';
import { DestinationsController } from './destinations.controller.js';

@Module({
  controllers: [DestinationsController],
  providers: [DestinationsService],
})
export class DestinationsModule {}