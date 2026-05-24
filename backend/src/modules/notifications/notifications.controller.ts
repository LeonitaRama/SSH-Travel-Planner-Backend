import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiSecurity,
  ApiHeader,
} from '@nestjs/swagger';

import { NotificationsService } from './notifications.service.js';
import { CreateNotificationDto } from './dto/create-notification.dto.js';
import { UpdateNotificationDto } from './dto/update-notification.dto.js';

import { TenantId } from '../../common/decorators/tenant.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { TenantGuard } from '../../common/guards/tenant.guard.js';
import { Role } from '../../common/enums/role.enum.js';

@ApiTags('Notifications')
@ApiBearerAuth('JWT-auth')
@ApiSecurity('tenant-id')
@Controller('notifications') // Shtova prefiksin e njëjtë me modulet e tjera për konsistencë
@UseGuards(AuthGuard('jwt'), RolesGuard, TenantGuard)
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Create notification' }) // U shtua përshkrimi sipas kërkesës
  create(@TenantId() tenantId: string, @Body() dto: CreateNotificationDto) {
    return this.service.create(tenantId, dto);
  }

  @Get()
  @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get notifications' }) // U shtua përshkrimi sipas kërkesës
  findAll(@TenantId() tenantId: string) {
    return this.service.findAll(tenantId);
  }

  @Get(':id')
  @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get notification by ID' })
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.service.findOne(tenantId, id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Update a notification' })
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateNotificationDto,
  ) {
    return this.service.update(tenantId, id, dto);
  }

  // --- FUNKSIONI I RI SPECIFIK: Mark notification as read ---
  @Patch(':id/read')
  @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Mark notification as read' }) // U shtua pika e tretë e kërkesës
  async markAsRead(@TenantId() tenantId: string, @Param('id') id: string) {
    // Falë BaseCrudService, mund t'i kalojmë direkt fushën që duam të përditësojmë
    return this.service.update(tenantId, id, { isRead: true });
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a notification' })
  remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.service.remove(tenantId, id);
  }
}
