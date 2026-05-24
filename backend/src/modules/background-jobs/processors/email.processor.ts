// src/modules/background-jobs/processors/email.processor.ts
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from '../../email/email.service.js';

@Processor('email-queue')
@Injectable()
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private emailService: EmailService) {
    super();
  }

  async process(job: Job): Promise<any> {
    this.logger.log(`Processing email job: ${job.name}`);

    switch (job.name) {
      case 'send-welcome-email':
        return await this.emailService.sendWelcomeEmail(
          job.data.email,
          job.data.name,
        );

      case 'send-booking-confirmation':
        return await this.emailService.sendBookingConfirmation(
          job.data.email,
          job.data.bookingId,
        );

      default:
        throw new Error(`Job ${job.name} not supported`);
    }
  }
}
