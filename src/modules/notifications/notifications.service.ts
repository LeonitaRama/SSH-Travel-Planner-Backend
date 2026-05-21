import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { BaseCrudService } from '../../common/services/base-crud.service.js';
import { CreateNotificationDto } from './dto/create-notification.dto.js';
import { UpdateNotificationDto } from './dto/update-notification.dto.js';

@Injectable()
export class NotificationsService extends BaseCrudService<
  any,
  CreateNotificationDto,
  UpdateNotificationDto
> {
  constructor(protected prismaService: PrismaService) {
    super(prismaService, {
      modelName: 'notification',
      defaultInclude: {
        tenant: true,
      },
    });
  }
}
