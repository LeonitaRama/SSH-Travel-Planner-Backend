import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string | undefined;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  destinationId: string | undefined;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  hotelId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  roomId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  flightId?: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsNotEmpty()
  numberOfGuests: number | undefined;

  @ApiProperty({ example: '2026-06-01' })
  @IsString()
  @IsNotEmpty()
  startDate: string | undefined;

  @ApiProperty({ example: '2026-06-10' })
  @IsString()
  @IsNotEmpty()
  endDate: string | undefined;
}
