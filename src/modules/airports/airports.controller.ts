import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiSecurity,
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiHeader,
} from '@nestjs/swagger';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { AirportsService } from './airports.service.js';
import { CreateAirportDto } from './dto/create-airport.dto.js';
import { UpdateAirportDto } from './dto/update-airport.dto.js';
import { TenantId } from '../../common/decorators/tenant.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { TenantGuard } from '../../common/guards/tenant.guard.js';
import { Role } from '../../common/enums/role.enum.js';

@ApiTags('Airports')
@ApiBearerAuth('JWT-auth')
@ApiSecurity('tenant-id')
@Controller('airports')
@UseGuards(AuthGuard('jwt'), RolesGuard, TenantGuard)
export class AirportsController {
  constructor(private readonly airportsService: AirportsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Create a new airport' })
  async create(@TenantId() tenantId: string, @Body() dto: CreateAirportDto) {
    return this.airportsService.create(tenantId, dto);
  }

  @Get()
  @UseInterceptors(CacheInterceptor) // Caching i listës së aeroporteve (Kërkesa 17)
  @CacheTTL(30) // Ruhet në cache për 30 sekonda
  @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all airports for current tenant' })
  async findAll(@TenantId() tenantId: string) {
    return this.airportsService.findAll(tenantId);
  }

  @Get(':id')
  @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get airport by ID' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.airportsService.findOne(tenantId, id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Update an airport' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAirportDto,
  ) {
    return this.airportsService.update(tenantId, id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete an airport' })
  async remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.airportsService.remove(tenantId, id);
  }

  @Get(':id/flights/departures')
  @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all departing flights from this airport' })
  async getDepartures(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.airportsService.findDepartures(tenantId, id);
  }

  @Get(':id/flights/arrivals')
  @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all arriving flights to this airport' })
  async getArrivals(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.airportsService.findArrivals(tenantId, id);
  }
}
