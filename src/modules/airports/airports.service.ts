import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { BaseCrudService } from '../../common/services/base-crud.service.js';
import { CreateAirportDto } from './dto/create-airport.dto.js';
import { UpdateAirportDto } from './dto/update-airport.dto.js';
import { Airport } from '@prisma/client';

@Injectable()
export class AirportsService extends BaseCrudService<
  Airport, // Mund ta zëvendësoni me tipin Airport nga @prisma/client nëse doni tipizim të fortë
  CreateAirportDto,
  UpdateAirportDto
> {
  constructor(protected prismaService: PrismaService) {
    super(prismaService, {
      modelName: 'Airport', // Duhet të përputhet ekzaktësisht me casen te BaseTenantService dhe Prisma
    });
  }
}
