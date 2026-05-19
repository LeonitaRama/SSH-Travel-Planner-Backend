import { ApiProperty } from '@nestjs/swagger';

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsUUID,
} from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ example: 'Deluxe Room' })
  @IsString()
  @IsNotEmpty()
  name: string | undefined;

  @ApiProperty({ example: 'Luxury room with sea view' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 120 })
  @IsNumber()
  price: number | undefined;

  @ApiProperty({ example: 2 })
  @IsNumber()
  capacity: number | undefined;

  @ApiProperty({ example: 'https://example.com/room.jpg' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    example: 'hotel-uuid',
    description: 'Hotel ID',
  })
  @IsUUID()
  hotelId: string | undefined;
}
