import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import { AiService } from '../ai/ai.service.js';
import { CreateAiRecommendationDto } from './dto/create-ai-recommendation.dto.js';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { TenantGuard } from '../../common/guards/tenant.guard.js';

@ApiTags('AI')
@ApiBearerAuth('JWT-auth')
@ApiSecurity('tenant-id')
@Controller('ai')
@UseGuards(AuthGuard('jwt'), RolesGuard, TenantGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('recommendations')
  @ApiOperation({
    summary: 'Generate AI travel recommendations',
  })
  async generateRecommendation(@Body() dto: CreateAiRecommendationDto) {
    return this.aiService.generateRecommendation(dto);
  }
}
