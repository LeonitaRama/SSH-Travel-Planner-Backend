// src/modules/background-jobs/background-jobs.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BookingProcessor } from './processors/booking.processor.js';
import { EmailProcessor } from './processors/email.processor.js';
import { CronTasksService } from './cron/cron-tasks.service.js';
import { BackgroundJobsService } from './background-jobs.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { BackgroundJobsController } from './background-jobs.controller.js';
import { EmailModule } from '../email/email.module.js';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    BullModule.registerQueue(
      { name: 'booking-queue' },
      { name: 'email-queue' },
    ),
    EmailModule,
  ],
  controllers: [BackgroundJobsController],
  providers: [
    BookingProcessor,
    EmailProcessor,
    CronTasksService,
    BackgroundJobsService, // ✅ Shto këtë
    NotificationsService,
    PrismaService,
  ],
  exports: [
    BullModule,
    BackgroundJobsService, // ✅ Eksporto që të përdoret nga module të tjera
  ],
})
export class BackgroundJobsModule {}
