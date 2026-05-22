import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateAiRecommendationDto {
  @ApiProperty({
    example: 'Paris',
  })
  @IsString()
  destination!: string;

  @ApiProperty({
    example: 1000,
  })
  @IsNumber()
  budget!: number;

  @ApiProperty({
    example: 'luxury hotels and museums',
  })
  @IsString()
  interests!: string;
}
