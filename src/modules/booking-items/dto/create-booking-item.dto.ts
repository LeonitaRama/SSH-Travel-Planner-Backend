import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateBookingItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bookingId: string | undefined;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string | undefined; // hotel | room | flight | tour

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  referenceId: string | undefined; // id e hotel/room/flight

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  price?: number;
}
