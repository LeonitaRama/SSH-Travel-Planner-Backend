import { Controller, Get, Body, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiSecurity,
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiHeader,
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
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Get settings for current tenant' })
  async getSettings(@TenantId() tenantId: string) {
    return this.settingsService.findSettings(tenantId);
  }

  @Patch()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update settings for current tenant' })
  async update(
    @TenantId() tenantId: string,
    @Body() dto: UpdateTenantSettingsDto,
  ) {
    // Përdorim upsert që nëse nuk ekziston fare blloku i settings, ta krijojë automatikisht
    return this.settingsService.update(tenantId, tenantId, dto);
  }
}
