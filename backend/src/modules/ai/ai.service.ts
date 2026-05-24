import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { CreateAiRecommendationDto } from './dto/create-ai-recommendation.dto.js';

@Injectable()
export class AiService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async generateRecommendation(dto: CreateAiRecommendationDto) {
    const prompt = `
      Give travel recommendations for:
      Destination: ${dto.destination}
      Budget: ${dto.budget}
      Interests: ${dto.interests}
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    return {
      recommendation: response.choices[0].message.content,
    };
  }
}
