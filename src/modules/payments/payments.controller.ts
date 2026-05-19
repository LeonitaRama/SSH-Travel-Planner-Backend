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

import { PaymentsService } from './payments.service.js';

import { CreatePaymentDto } from './dto/create-payment.dto.js';
import { UpdatePaymentDto } from './dto/update-payment.dto.js';

import { TenantId } from '../../common/decorators/tenant.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';

import { RolesGuard } from '../../common/guards/roles.guard.js';
import { TenantGuard } from '../../common/guards/tenant.guard.js';

import { Role } from '../../common/enums/role.enum.js';

@ApiTags('Payments')
@ApiBearerAuth('JWT-auth')
@ApiSecurity('tenant-id')
@Controller('payments')
@UseGuards(AuthGuard('jwt'), RolesGuard, TenantGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Create payment' })
  async create(@TenantId() tenantId: string, @Body() dto: CreatePaymentDto) {
    return this.paymentsService.create(tenantId, dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Get all payments' })
  async findAll(@TenantId() tenantId: string) {
    return this.paymentsService.findAll(tenantId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Get payment by id' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.paymentsService.findOne(tenantId, id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update payment' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdatePaymentDto,
  ) {
    return this.paymentsService.update(tenantId, id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete payment' })
  async remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.paymentsService.remove(tenantId, id);
  }
}
