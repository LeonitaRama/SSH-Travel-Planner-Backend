import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

import { BaseCrudService } from '../../common/services/base-crud.service.js';

import { CreateAuditLogDto } from './dto/create-audit-log.dto.js';
import { UpdateAuditLogDto } from './dto/update-audit-log.dto.js';

@Injectable()
export class AuditLogsService extends BaseCrudService<
  any,
  CreateAuditLogDto,
  UpdateAuditLogDto
> {
  constructor(protected prismaService: PrismaService) {
    super(prismaService, {
      modelName: 'AuditLog',
    });
  }
}
