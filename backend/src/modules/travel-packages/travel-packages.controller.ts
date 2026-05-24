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
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { TravelPackagesService } from './travel-packages.service.js';
import { CreateTravelPackageDto } from './dto/create-travel-package.dto.js';
import { UpdateTravelPackageDto } from './dto/update-travel-package.dto.js';

import { TenantId } from '../../common/decorators/tenant.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { TenantGuard } from '../../common/guards/tenant.guard.js';
import { Role } from '../../common/enums/role.enum.js';

@ApiTags('TravelPackages')
@ApiBearerAuth('JWT-auth')
@Controller('travel-packages')
@UseGuards(AuthGuard('jwt'), RolesGuard, TenantGuard)
export class TravelPackagesController {
  constructor(private readonly service: TravelPackagesService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Create a new travel package' })
  create(@TenantId() tenantId: string, @Body() dto: CreateTravelPackageDto) {
    return this.service.create(tenantId, dto);
  }

  @Get()
  @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all travel packages' })
  findAll(@TenantId() tenantId: string) {
    return this.service.findAll(tenantId);
  }

  @Get(':id')
  @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get travel package by ID' })
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.service.findOne(tenantId, id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Update travel package' })
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateTravelPackageDto,
  ) {
    return this.service.update(tenantId, id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete travel package' })
  remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.service.remove(tenantId, id);
  }

  @Post(':id/hotels')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Add a hotel to a travel package' })
  addHotel(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body('hotelId') hotelId: string,
  ) {
    return this.service.addHotelToPackage(tenantId, id, hotelId);
  }

  @Delete(':id/hotels/:hotelId')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Remove a hotel from a travel package' })
  removeHotel(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Param('hotelId') hotelId: string,
  ) {
    return this.service.removeHotelFromPackage(tenantId, id, hotelId);
  }

  @Post(':id/flights')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Add a flight to a travel package' })
  addFlight(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body('flightId') flightId: string,
  ) {
    return this.service.addFlightToPackage(tenantId, id, flightId);
  }

  @Delete(':id/flights/:flightId')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Remove a flight from a travel package' })
  removeFlight(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Param('flightId') flightId: string,
  ) {
    return this.service.removeFlightFromPackage(tenantId, id, flightId);
  }
}
