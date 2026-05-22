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
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiSecurity,
} from '@nestjs/swagger';

import { BookingsService } from './bookings.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { UpdateBookingDto } from './dto/update-booking.dto.js';

import { TenantId } from '../../common/decorators/tenant.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';

import { RolesGuard } from '../../common/guards/roles.guard.js';
import { TenantGuard } from '../../common/guards/tenant.guard.js';

import { Role } from '../../common/enums/role.enum.js';
import { CreateBookingItemDto } from '../booking-items/dto/create-booking-item.dto.js';
import { CreatePaymentDto } from '../payments/dto/create-payment.dto.js';

@ApiTags('Bookings')
@ApiBearerAuth('JWT-auth')
@ApiSecurity('tenant-id')
@Controller('bookings')
@UseGuards(AuthGuard('jwt'), RolesGuard, TenantGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF, Role.CUSTOMER)
  @ApiOperation({ summary: 'Create booking' })
  async create(@TenantId() tenantId: string, @Body() dto: CreateBookingDto) {
    return this.bookingsService.create(tenantId, dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Get all bookings' })
  async findAll(@TenantId() tenantId: string) {
    return this.bookingsService.findAll(tenantId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF, Role.CUSTOMER)
  @ApiOperation({ summary: 'Get booking by ID' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.bookingsService.findOne(tenantId, id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Update booking' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateBookingDto,
  ) {
    return this.bookingsService.update(tenantId, id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete booking' })
  async remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.bookingsService.remove(tenantId, id);
  }

  @Get(':id/items')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF, Role.CUSTOMER)
  @ApiOperation({ summary: 'Get all items for a specific booking' })
  async findItems(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.bookingsService.findItemsByBooking(tenantId, id);
  }

  @Post(':id/items')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF, Role.CUSTOMER)
  @ApiOperation({ summary: 'Add a new item to an existing booking' })
  async addItem(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() itemDto:CreateBookingItemDto, // Zëvendësoje 'any' me CreateBookingItemDto tuaj
  ) {
    return this.bookingsService.addItemToBooking(tenantId, id, itemDto);
  }

  @Post(':id/cancel')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF, Role.CUSTOMER)
  @ApiOperation({ summary: 'Cancel booking and update status' })
  async cancel(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.bookingsService.cancelBooking(tenantId, id);
  }

  @Get(':id/payments')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF, Role.CUSTOMER)
  @ApiOperation({ summary: 'Get all payments for a specific booking' })
  async findPayments(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.bookingsService.findPaymentsByBooking(tenantId, id);
  }

  @Post(':id/payments')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF, Role.CUSTOMER)
  @ApiOperation({ summary: 'Process a payment for a specific booking' })
  async addPayment(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() paymentDto: CreatePaymentDto, // Zëvendësoje 'any' me CreatePaymentDto tuaj
  ) {
    return this.bookingsService.addPaymentToBooking(tenantId, id, paymentDto);
  }
}
