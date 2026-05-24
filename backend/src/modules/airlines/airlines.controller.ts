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
  ApiHeader,
} from '@nestjs/swagger';
import { AirlinesService } from './airlines.service.js';
import { CreateAirlineDto } from './dto/create-airline.dto.js';
import { UpdateAirlineDto } from './dto/update-airline.dto.js';
import { TenantId } from '../../common/decorators/tenant.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { TenantGuard } from '../../common/guards/tenant.guard.js';
import { Role } from '../../common/enums/role.enum.js';

@ApiTags('Airlines')
@ApiBearerAuth('JWT-auth')
@ApiSecurity('tenant-id')
@Controller('airlines')
@UseGuards(AuthGuard('jwt'), RolesGuard, TenantGuard)
export class AirlinesController {
  constructor(private readonly airlinesService: AirlinesService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Create a new airline' })
  async create(@TenantId() tenantId: string, @Body() dto: CreateAirlineDto) {
    return this.airlinesService.create(tenantId, dto);
  }

  @Get()
  @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all airlines for current tenant' })
  async findAll(@TenantId() tenantId: string) {
    return this.airlinesService.findAll(tenantId);
  }

  @Get(':id')
  @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get airline by ID' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.airlinesService.findOne(tenantId, id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Update an airline' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAirlineDto,
  ) {
    return this.airlinesService.update(tenantId, id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete an airline' })
  async remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.airlinesService.remove(tenantId, id);
  }
}
