import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { BaseCrudService } from '../../common/services/base-crud.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { UpdateBookingDto } from './dto/update-booking.dto.js';
import { Booking } from '@prisma/client';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { BackgroundJobsService } from '../background-jobs/background-jobs.service.js';

@Injectable()
export class BookingsService extends BaseCrudService<
  Booking,
  CreateBookingDto,
  UpdateBookingDto
> {
  constructor(
    protected prismaService: PrismaService,

    @InjectQueue('booking-queue')
    private bookingQueue: Queue,

    private backgroundJobsService: BackgroundJobsService,
  ) {
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

  async create(tenantId: string, dto: CreateBookingDto) {
    const booking = await super.create(tenantId, dto);

    const user = await this.prismaService.user.findUnique({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const job = await this.bookingQueue.add(
      'process-confirmation',
      {
        bookingId: booking.id,
        tenantId,
        userId: dto.userId,
      },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    );

    await this.bookingQueue.add('send-booking-confirmation', {
      email: user.email,
      bookingId: booking.id,
    });

    await this.backgroundJobsService.logJob(
      String(job.id),
      'booking-queue',
      'process-confirmation',
      job.data,
      tenantId,
      dto.userId,
      booking.id,
    );

    return booking;
  }
}
