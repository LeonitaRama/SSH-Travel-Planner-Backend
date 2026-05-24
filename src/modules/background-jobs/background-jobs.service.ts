import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { JobStatus } from '@prisma/client';

@Injectable()
export class BackgroundJobsService {
  constructor(private prisma: PrismaService) {}

  async logJob(
    jobId: string,
    queueName: string,
    jobName: string,
    data: any,
    tenantId?: string,
    userId?: string,
    bookingId?: string,
  ) {
    return this.prisma.backgroundJob.create({
      data: {
        jobId,
        queueName,
        jobName,
        data,
        status: JobStatus.PENDING,
        tenantId,
        userId,
        bookingId,
      },
    });
  }

  async updateJobStatus(
    jobId: string,
    status: JobStatus,
    error?: string,
    result?: any,
  ) {
    const updateData: any = { status };
    if (error) updateData.error = error;
    if (result) updateData.result = result;
    if (status === JobStatus.COMPLETED) updateData.completedAt = new Date();

    return this.prisma.backgroundJob.update({
      where: { jobId },
      data: updateData,
    });
  }

  async getFailedJobs(tenantId?: string) {
    return this.prisma.backgroundJob.findMany({
      where: {
        status: JobStatus.FAILED,
        ...(tenantId && { tenantId }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
