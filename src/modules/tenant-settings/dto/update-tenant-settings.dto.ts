// src/modules/tenant-settings/dto/update-tenant-settings.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateTenantSettingsDto } from './create-tenant-settings.dto.js';

export class UpdateTenantSettingsDto extends PartialType(
  CreateTenantSettingsDto,
) {}
