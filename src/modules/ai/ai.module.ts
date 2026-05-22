import { Module } from '@nestjs/common';

import { AiController } from '../ai/ai.controller.js';
import { AiService } from './ai.service.js';

@Module({
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
