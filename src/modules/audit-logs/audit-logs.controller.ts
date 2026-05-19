import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import { AuditLogsService } from './audit-logs.service.js';

import { CreateAuditLogDto } from './dto/create-audit-log.dto.js';
import { UpdateAuditLogDto } from './dto/update-audit-log.dto.js';

import { TenantId } from '../../common/decorators/tenant.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';

import { RolesGuard } from '../../common/guards/roles.guard.js';
import { TenantGuard } from '../../common/guards/tenant.guard.js';

import { Role } from '../../common/enums/role.enum.js';

@ApiTags('AuditLogs')
@ApiBearerAuth('JWT-auth')
@ApiSecurity('tenant-id')
@Controller('audit-logs')
@UseGuards(AuthGuard('jwt'), RolesGuard, TenantGuard)
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Create audit log' })
  async create(@TenantId() tenantId: string, @Body() dto: CreateAuditLogDto) {
    return this.auditLogsService.create(tenantId, dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Get all audit logs' })
  async findAll(@TenantId() tenantId: string) {
    return this.auditLogsService.findAll(tenantId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Get audit log by ID' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.auditLogsService.findOne(tenantId, id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update audit log' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAuditLogDto,
  ) {
    return this.auditLogsService.update(tenantId, id, dto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete audit log' })
  async remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.auditLogsService.remove(tenantId, id);
  }
}
