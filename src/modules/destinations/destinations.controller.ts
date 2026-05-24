import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiSecurity,
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiHeader,
} from '@nestjs/swagger';
import { DestinationsService } from './destinations.service.js';
import { CreateDestinationDto } from './dto/create-destination.dto.js';
import { UpdateDestinationDto } from './dto/update-destination.dto.js';
import { TenantId } from '../../common/decorators/tenant.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { TenantGuard } from '../../common/guards/tenant.guard.js';
import { Role } from '../../common/enums/role.enum.js';

@ApiTags('Destinations')
@ApiBearerAuth('JWT-auth')
@ApiSecurity('tenant-id')
@Controller('destinations')
@UseGuards(AuthGuard('jwt'), RolesGuard, TenantGuard)
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Create a new destination' })
  // async create(
  //   @TenantId() tenantId: string,
  //   @Body() dto: CreateDestinationDto,
  // ) {
  //   console.log('TenantId from decorator:', tenantId);
  //   return this.destinationsService.create(tenantId, dto);
  // }
  async create(@Req() req: Request, @Body() dto: CreateDestinationDto) {
    const tenantId = req.headers['tenant-id'] || req.headers['x-tenant-id'];
    console.log('TenantId from decorator:', tenantId);
    return this.destinationsService.create(tenantId as string, dto);
  }

  @Get()
  @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all destinations for current tenant' })
  async findAll(@TenantId() tenantId: string) {
    return this.destinationsService.findAll(tenantId);
  }

  @Get(':id')
  @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get destination by ID' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.destinationsService.findOne(tenantId, id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Update a destination' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateDestinationDto,
  ) {
    return this.destinationsService.update(tenantId, id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a destination' })
  async remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.destinationsService.remove(tenantId, id);
  }

  @Get(':id/hotels')
  @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all hotels for a specific destination' })
  async getHotelsByDestination(
    @TenantId() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.destinationsService.findHotelsByDestination(tenantId, id);
  }

  @Get(':id/flights')
  @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all flights for a specific destination' })
  async getFlightsByDestination(
    @TenantId() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.destinationsService.findFlightsByDestination(tenantId, id);
  }
}
