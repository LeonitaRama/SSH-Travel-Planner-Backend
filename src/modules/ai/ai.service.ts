import { Injectable } from '@nestjs/common';
import { CreateAiRecommendationDto } from './dto/create-ai-recommendation.dto.js';

@Injectable()
export class AiService {
  async generateRecommendation(dto: CreateAiRecommendationDto) {
    return {
      recommendation: `
Travel recommendation for ${dto.destination}

Budget: ${dto.budget} €

Recommended activities based on your interests:
- Visit famous museums
- Stay in luxury hotels
- Explore local restaurants
- Book guided city tours

Suggested trip duration:
5-7 days
      `,
    };
  }
}
