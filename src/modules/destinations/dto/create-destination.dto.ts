import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDestinationDto {
  @ApiProperty({ example: 'Paris' })
  @IsString()
  @IsNotEmpty()
  name: string | undefined;

  @ApiProperty({ example: 'France' })
  @IsString()
  @IsNotEmpty()
  country: string | undefined;

  @ApiProperty({ example: 'The city of lights', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'https://example.com/paris.jpg', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}
