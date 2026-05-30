// src/modules/tenant-settings/tenant-settings.service.ts
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

    let settings = await this.prismaService.tenantSettings.findUnique({
      where: { tenantId },
    });

    // Nëse nuk ekzistojnë settings, krijo default
    if (!settings) {
      settings = await this.prismaService.tenantSettings.create({
        data: {
          tenantId,
          theme: 'light',
          language: 'en',
          currency: 'EUR',
        },
      });
    }

    await this.cacheManager.set(cacheKey, settings, 300000); // 5 min

    return settings;
  }

  async updateSettings(tenantId: string, dto: UpdateTenantSettingsDto) {
    // Gjej settings ekzistues
    let settings = await this.prismaService.tenantSettings.findUnique({
      where: { tenantId },
    });

    // Nëse nuk ekziston, krijo
    if (!settings) {
      settings = await this.prismaService.tenantSettings.create({
        data: {
          tenantId,
          theme: dto.theme || 'light',
          language: dto.language || 'en',
          currency: dto.currency || 'EUR',
        },
      });
    } else {
      // Update ekzistues - përdor update direkt me id
      settings = await this.prismaService.tenantSettings.update({
        where: { id: settings.id },
        data: {
          ...(dto.theme !== undefined && { theme: dto.theme }),
          ...(dto.language !== undefined && { language: dto.language }),
          ...(dto.currency !== undefined && { currency: dto.currency }),
        },
      });
    }

    // Fshi cache-in
    const cacheKey = `tenant-settings-${tenantId}`;
    await this.cacheManager.del(cacheKey);

    return settings;
  }
}
