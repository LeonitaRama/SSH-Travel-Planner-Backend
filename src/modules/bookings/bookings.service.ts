import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { BaseCrudService } from '../../common/services/base-crud.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { UpdateBookingDto } from './dto/update-booking.dto.js';

@Injectable()
export class BookingsService extends BaseCrudService<
  any,
  CreateBookingDto,
  UpdateBookingDto
> {
  constructor(protected prismaService: PrismaService) {
    super(prismaService, {
      modelName: 'booking',
      defaultInclude: {
        destination: true,
        hotel: true,
        room: true,
        flight: true,
      },
    });
  }

  async findItemsByBooking(tenantId: string, bookingId: string) {
    return this.prismaService.bookingItem.findMany({
      where: { tenantId, bookingId },
    });
  }

  async addItemToBooking(tenantId: string, bookingId: string, itemDto: any) {
    return this.prismaService.bookingItem.create({
      data: {
        ...itemDto,
        bookingId,
        tenantId,
      },
    });
  }

  async cancelBooking(tenantId: string, bookingId: string) {
    return this.prismaService.booking.update({
      where: { id: bookingId, tenantId },
      data: { status: 'CANCELLED' },
    });
  }

  async findPaymentsByBooking(tenantId: string, bookingId: string) {
    return this.prismaService.payment.findMany({
      where: { tenantId, bookingId },
    });
  }

  async addPaymentToBooking(
    tenantId: string,
    bookingId: string,
    paymentDto: any,
  ) {
    return this.prismaService.payment.create({
      data: {
        ...paymentDto,
        bookingId,
        tenantId,
      },
    });
  }
}
