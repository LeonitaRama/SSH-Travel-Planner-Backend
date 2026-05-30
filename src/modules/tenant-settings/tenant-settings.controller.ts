// src/modules/tenant-settings/tenant-settings.controller.ts
import { Controller, Get, Body, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiSecurity,
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { TenantSettingsService } from './tenant-settings.service.js';
import { UpdateTenantSettingsDto } from './dto/update-tenant-settings.dto.js';
import { TenantId } from '../../common/decorators/tenant.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { TenantGuard } from '../../common/guards/tenant.guard.js';
import { Role } from '../../common/enums/role.enum.js';

@ApiTags('Tenant Settings')
@ApiBearerAuth('JWT-auth')
@ApiSecurity('tenant-id')
@Controller('tenant-settings')
@UseGuards(AuthGuard('jwt'), RolesGuard, TenantGuard)
export class TenantSettingsController {
  constructor(private readonly settingsService: TenantSettingsService) {}

  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF, Role.CUSTOMER)
  @ApiOperation({ summary: 'Get settings for current tenant' })
  @ApiResponse({ status: 200, description: 'Settings retrieved successfully' })
  async getSettings(@TenantId() tenantId: string) {
    return this.settingsService.findSettings(tenantId);
  }

  @Patch()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update settings for current tenant (Admin only)' })
  @ApiResponse({ status: 200, description: 'Settings updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async update(
    @TenantId() tenantId: string,
    @Body() dto: UpdateTenantSettingsDto,
  ) {
    return this.settingsService.updateSettings(tenantId, dto);
  }
}
