import { Module } from '@nestjs/common';
import { TenantSettingsService } from './tenant-settings.service.js';
import { TenantSettingsController } from './tenant-settings.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [TenantSettingsController],
  providers: [TenantSettingsService],
  exports: [TenantSettingsService],
})
export class TenantSettingsModule {}