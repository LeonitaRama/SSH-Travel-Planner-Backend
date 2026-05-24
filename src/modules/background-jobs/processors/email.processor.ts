// src/modules/background-jobs/processors/email.processor.ts
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';

@Processor('email-queue')
@Injectable()
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  async process(job: Job): Promise<any> {
    this.logger.log(`Processing email job: ${job.name}`);

    switch (job.name) {
      case 'send-welcome-email':
        return await this.sendWelcomeEmail(job.data);
      default:
        throw new Error(`Job name ${job.name} not supported`);
    }
  }

  private async sendWelcomeEmail(data: { email: string; name: string }) {
    this.logger.log(`Sending welcome email to ${data.email}`);
    // Këtu shto logjikën e dërgimit të email-it
    return { success: true, email: data.email };
  }
}
