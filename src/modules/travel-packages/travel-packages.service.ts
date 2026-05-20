import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { BaseCrudService } from '../../common/services/base-crud.service.js';
import { CreateTravelPackageDto } from './dto/create-travel-package.dto.js';
import { UpdateTravelPackageDto } from './dto/update-travel-package.dto.js';

@Injectable()
export class TravelPackagesService extends BaseCrudService<
  any,
  CreateTravelPackageDto,
  UpdateTravelPackageDto
> {
  constructor(protected prismaService: PrismaService) {
    super(prismaService, {
      modelName: 'TravelPackage',
      defaultInclude: {
        destination: true,
      },
    });
  }
}
