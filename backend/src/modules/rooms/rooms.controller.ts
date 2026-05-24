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

import { RoomsService } from './rooms.service.js';

import { CreateRoomDto } from './dto/create-room.dto.js';
import { UpdateRoomDto } from './dto/update-room.dto.js';

import { TenantId } from '../../common/decorators/tenant.decorator.js';

import { Roles } from '../../common/decorators/roles.decorator.js';

import { RolesGuard } from '../../common/guards/roles.guard.js';
import { TenantGuard } from '../../common/guards/tenant.guard.js';

import { Role } from '../../common/enums/role.enum.js';

@ApiTags('Rooms')
@ApiBearerAuth('JWT-auth')
@ApiSecurity('tenant-id')
@Controller('rooms')
@UseGuards(AuthGuard('jwt'), RolesGuard, TenantGuard)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Create a new room' })
  async create(@TenantId() tenantId: string, @Body() dto: CreateRoomDto) {
    return this.roomsService.create(tenantId, dto);
  }

  @Get()
  @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all rooms' })
  async findAll(@TenantId() tenantId: string) {
    return this.roomsService.findAll(tenantId);
  }

  @Get(':id')
  @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get room by ID' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.roomsService.findOne(tenantId, id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Update room' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateRoomDto,
  ) {
    return this.roomsService.update(tenantId, id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete room' })
  async remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.roomsService.remove(tenantId, id);
  }
}
