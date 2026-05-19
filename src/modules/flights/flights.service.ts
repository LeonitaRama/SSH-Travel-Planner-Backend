import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

import { BaseCrudService } from '../../common/services/base-crud.service.js';

import { CreateFlightDto } from './dto/create-flight.dto.js';
import { UpdateFlightDto } from './dto/update-flight.dto.js';

@Injectable()
export class FlightsService extends BaseCrudService<
  any,
  CreateFlightDto,
  UpdateFlightDto
> {
  constructor(protected prismaService: PrismaService) {
    super(prismaService, {
      modelName: 'Flight',
    });
  }
}
