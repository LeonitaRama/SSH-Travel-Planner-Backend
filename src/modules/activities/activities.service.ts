import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { BaseCrudService } from '../../common/services/base-crud.service.js';
import { CreateActivityDto } from './dto/create-activity.dto.js';
import { UpdateActivityDto } from './dto/update-activity.dto.js';
import { Activity } from '@prisma/client';

@Injectable()
export class ActivitiesService extends BaseCrudService<
  Activity,
  CreateActivityDto,
  UpdateActivityDto
> {
  constructor(protected prismaService: PrismaService) {
    super(prismaService, {
      modelName: 'activity', // Duhet të përputhet me emrin te BaseTenantService
      defaultInclude: {
        destination: true, // Kjo do të kthejë automatikisht objektin e destinacionit në çdo query!
      },
    });
  }
}
