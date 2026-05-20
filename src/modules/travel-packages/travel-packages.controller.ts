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
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

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
  @Roles(Role.ADMIN, Role.STAFF)
  create(@TenantId() tenantId: string, @Body() dto: CreateTravelPackageDto) {
    return this.service.create(tenantId, dto);
  }

  @Get()
  findAll(@TenantId() tenantId: string) {
    return this.service.findAll(tenantId);
  }

  @Get(':id')
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.service.findOne(tenantId, id);
  }

  @Patch(':id')
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateTravelPackageDto,
  ) {
    return this.service.update(tenantId, id, dto);
  }

  @Delete(':id')
  remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.service.remove(tenantId, id);
  }
}
