import { ApiProperty } from '@nestjs/swagger';

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number | undefined;

  @ApiProperty({ example: 'Amazing hotel and service' })
  @IsString()
  @IsNotEmpty()
  comment: string | undefined;

  @ApiProperty({ example: 'hotel-id', required: false })
  @IsString()
  @IsOptional()
  hotelId?: string;

  @ApiProperty({ example: 'destination-id', required: false })
  @IsString()
  @IsOptional()
  destinationId?: string;
}
