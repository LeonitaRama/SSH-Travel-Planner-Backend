import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { BaseCrudService } from '../../common/services/base-crud.service.js';
import { CreateTenantSettingsDto } from './dto/create-tenant-settings.dto.js';
import { UpdateTenantSettingsDto } from './dto/update-tenant-settings.dto.js';
import { TenantSetting } from '@prisma/client';
@Injectable()
export class TenantSettingsService extends BaseCrudService<
  TenantSettings,
  CreateTenantSettingsDto,
  UpdateTenantSettingsDto
> {
  constructor(protected prismaService: PrismaService) {
    super(prismaService, {
      modelName: 'tenantSettings', // camelCase ekzakt siç e gjeneron Prisma Client
    });
  }

  // Mbishkruajmë findAll që të kthejë vetëm konfigurimin e atij tenanti specifik
  async findSettings(tenantId: string) {
    return this.prismaService.tenantSettings.findUnique({
      where: { tenantId },
    });
  }
}
