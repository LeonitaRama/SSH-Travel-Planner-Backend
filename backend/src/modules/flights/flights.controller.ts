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
  ApiSecurity,
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';

import { FlightsService } from './flights.service.js';

import { CreateFlightDto } from './dto/create-flight.dto.js';
import { UpdateFlightDto } from './dto/update-flight.dto.js';

import { TenantId } from '../../common/decorators/tenant.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';

import { RolesGuard } from '../../common/guards/roles.guard.js';
import { TenantGuard } from '../../common/guards/tenant.guard.js';

import { Role } from '../../common/enums/role.enum.js';

@ApiTags('Flights')
@ApiBearerAuth('JWT-auth')
@ApiSecurity('tenant-id')
@Controller('flights')
@UseGuards(AuthGuard('jwt'), RolesGuard, TenantGuard)
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Create a new flight' })
  async create(@TenantId() tenantId: string, @Body() dto: CreateFlightDto) {
    return this.flightsService.create(tenantId, dto);
  }

  @Get()
  @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all flights for current tenant' })
  async findAll(@TenantId() tenantId: string) {
    return this.flightsService.findAll(tenantId);
  }

  @Get(':id')
  @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get flight by ID' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.flightsService.findOne(tenantId, id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Update a flight' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateFlightDto,
  ) {
    return this.flightsService.update(tenantId, id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a flight' })
  async remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.flightsService.remove(tenantId, id);
  }
}
