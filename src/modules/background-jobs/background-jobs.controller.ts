import { Controller, Get } from '@nestjs/common';
import { BackgroundJobsService } from './background-jobs.service.js';

@Controller('background-jobs')
export class BackgroundJobsController {
  constructor(private readonly jobsService: BackgroundJobsService) {}

  @Get('failed')
  getFailedJobs() {
    return this.jobsService.getFailedJobs();
  }
}
