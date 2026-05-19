import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiSecurity,
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { HotelsService } from './hotels.service.js';
import { CreateHotelDto } from './dto/create-hotel.dto.js';
import { UpdateHotelDto } from './dto/update-hotel.dto.js';
import { TenantId } from '../../common/decorators/tenant.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { TenantGuard } from '../../common/guards/tenant.guard.js';
import { Role } from '../../common/enums/role.enum.js';

@ApiTags('Hotels')
@ApiBearerAuth('JWT-auth')
@ApiSecurity('tenant-id')
@Controller('hotels')
@UseGuards(AuthGuard('jwt'), RolesGuard, TenantGuard)
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Create a new hotel' })
  async create(@TenantId() tenantId: string, @Body() dto: CreateHotelDto) {
    return this.hotelsService.create(tenantId, dto);
  }

  @Get()
  @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all hotels for current tenant' })
  @ApiQuery({
    name: 'destinationId',
    required: false,
    description: 'Filter by destination ID',
  })
  async findAll(
    @TenantId() tenantId: string,
    @Query('destinationId') destinationId?: string,
  ) {
    if (destinationId) {
      return this.hotelsService.findByDestination(tenantId, destinationId);
    }
    return this.hotelsService.findAll(tenantId);
  }

  @Get(':id')
  @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get hotel by ID' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.hotelsService.findOne(tenantId, id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Update a hotel' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateHotelDto,
  ) {
    return this.hotelsService.update(tenantId, id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a hotel' })
  async remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.hotelsService.remove(tenantId, id);
  }
}
