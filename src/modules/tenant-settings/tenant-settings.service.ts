import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

import { PrismaService } from '../prisma/prisma.service.js';
import { BaseCrudService } from '../../common/services/base-crud.service.js';
import { CreateTenantSettingsDto } from './dto/create-tenant-settings.dto.js';
import { UpdateTenantSettingsDto } from './dto/update-tenant-settings.dto.js';
import { TenantSettings } from '@prisma/client';

@Injectable()
export class TenantSettingsService extends BaseCrudService<
  TenantSettings,
  CreateTenantSettingsDto,
  UpdateTenantSettingsDto
> {
  constructor(
    protected prismaService: PrismaService,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {
    super(prismaService, {
      modelName: 'tenantSettings',
    });
  }

  async findSettings(tenantId: string) {
    const cacheKey = `tenant-settings-${tenantId}`;

    const cached = await this.cacheManager.get(cacheKey);

    if (cached) {
      console.log('Returned tenant settings from cache');
      return cached;
    }

    const settings = await this.prismaService.tenantSettings.findUnique({
      where: { tenantId },
    });

    await this.cacheManager.set(cacheKey, settings, 300000); // 5 min

    return settings;
  }
}
