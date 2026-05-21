import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { BaseCrudService } from '../../common/services/base-crud.service.js';
import { CreateAirlineDto } from './dto/create-airline.dto.js';
import { UpdateAirlineDto } from './dto/update-airline.dto.js';
import { Airline } from '@prisma/client';

@Injectable()
export class AirlinesService extends BaseCrudService<
  Airline, // Mund ta zëvendësoni me tipin Airline nga @prisma/client nëse dëshironi tipizim të fortë
  CreateAirlineDto,
  UpdateAirlineDto
> {
  constructor(protected prismaService: PrismaService) {
    super(prismaService, {
      modelName: 'airline', // Duhet të përputhet ekzaktësisht me emrin e modelit në schema.prisma
    });
  }
}
