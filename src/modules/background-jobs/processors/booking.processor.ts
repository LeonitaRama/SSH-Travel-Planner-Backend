// src/modules/background-jobs/processors/booking.processor.ts
import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { NotificationsService } from '../../notifications/notifications.service.js';
import { BackgroundJobsService } from '../background-jobs.service.js';
import { JobStatus } from '@prisma/client';

@Processor('booking-queue')
@Injectable()
export class BookingProcessor extends WorkerHost {
  private readonly logger = new Logger(BookingProcessor.name);

  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
    private backgroundJobsService: BackgroundJobsService,

    @InjectQueue('email-queue')
    private emailQueue: Queue,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing job: ${job.name} with ID: ${job.id}`);

    const jobId = job.id as string;

    try {
      // 1. Përditëso statusin e Job-it në DB si PROCESSING
      if (job.id && this.backgroundJobsService) {
        await this.backgroundJobsService.updateJobStatus(
          jobId,
          JobStatus.PROCESSING,
        );
      }

      let result;

      switch (job.name) {
        case 'process-confirmation':
          result = await this.handleConfirmation(job.data);
          break;
        default:
          throw new Error(`Job name ${job.name} not supported`);
      }

      // 2. Nëse çdo gjë shkon mirë, përditëso statusin në COMPLETED
      if (job.id && this.backgroundJobsService) {
        await this.backgroundJobsService.updateJobStatus(
          jobId,
          JobStatus.COMPLETED,
          undefined,
          result,
        );
      }

      return result;
    } catch (error) {
      // 3. Error handling i sigurt
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Job ${jobId} failed: ${errorMessage}`);

      if (job.id && this.backgroundJobsService) {
        await this.backgroundJobsService.updateJobStatus(
          jobId,
          JobStatus.FAILED,
          errorMessage,
        );
      }

      throw error;
    }
  }

  private async handleConfirmation(data: {
    bookingId: string;
    tenantId: string;
    userId: string;
  }) {
    const { bookingId, tenantId, userId } = data;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    this.logger.log(`Confirming booking ${bookingId} for tenant ${tenantId}`);

    // 2. Update booking
    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId, tenantId },
      data: { status: 'CONFIRMED' },
    });

    // 3. Send notification + email (PARALLEL)
    await Promise.all([
      this.notificationsService.create(tenantId, {
        userId,
        title: 'Booking Confirmed 🎉',
        message: `Your booking ${bookingId} has been successfully confirmed.`,
        type: 'booking',
      }),

      this.emailQueue.add('send-booking-confirmation', {
        email: user.email,
        bookingId,
      }),
    ]);

    return {
      success: true,
      bookingId,
      status: updatedBooking.status,
    };
  }
}
