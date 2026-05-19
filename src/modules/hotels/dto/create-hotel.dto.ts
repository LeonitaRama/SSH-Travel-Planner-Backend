import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsUUID,
} from 'class-validator';

export class CreateHotelDto {
  @ApiProperty({ example: 'Hilton Paris' })
  @IsString()
  @IsNotEmpty()
  name: string | undefined;

  @ApiProperty({ example: '5-star luxury hotel in city center' })
  @IsString()
  @IsNotEmpty()
  description: string | undefined;

  @ApiProperty({ example: 'Paris, France' })
  @IsString()
  @IsNotEmpty()
  address: string | undefined;

  @ApiProperty({ example: 4.5 })
  @IsNumber()
  @Min(0)
  @Max(5)
  @IsOptional()
  rating?: number;

  @ApiProperty({ example: 150.0 })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  pricePerNight: number | undefined;

  @ApiProperty({ example: 'https://example.com/hotel.jpg', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  destinationId: string | undefined;
}
