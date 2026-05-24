// src/modules/background-jobs/cron/cron-tasks.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class CronTasksService {
  private readonly logger = new Logger(CronTasksService.name);

  constructor(private prisma: PrismaService) {}

  // Ekzekutohet çdo mesnatë për të anuluar rezervimet e papaguara
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleExpiredBookings() {
    this.logger.log('Running cron job for expired bookings...');

    // Anulo rezervimet që janë PENDING për më shumë se 24 orë
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const result = await this.prisma.booking.updateMany({
      where: {
        status: 'PENDING',
        createdAt: { lt: oneDayAgo },
      },
      data: { status: 'CANCELLED' },
    });

    this.logger.log(`Cancelled ${result.count} expired bookings`);
  }

  // Opsionale: Cron job çdo orë për të pastruar job-et e vjetra
  @Cron('0 * * * *') // Çdo orë në minutën 0
  async cleanupOldJobs() {
    this.logger.log('Cleaning up old background jobs...');

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const result = await this.prisma.backgroundJob.deleteMany({
      where: {
        createdAt: { lt: sevenDaysAgo },
        status: { in: ['COMPLETED', 'FAILED'] },
      },
    });

    this.logger.log(`Deleted ${result.count} old background jobs`);
  }
}
