import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateFlightDto {
  @ApiProperty({ example: 'TK101' })
  @IsString()
  @IsNotEmpty()
  flightNumber: string | undefined;

  @ApiProperty({ example: 'Turkish Airlines' })
  @IsString()
  @IsNotEmpty()
  airline: string | undefined;

  @ApiProperty({ example: 'Prishtina' })
  @IsString()
  @IsNotEmpty()
  departureCity: string | undefined;

  @ApiProperty({ example: 'Istanbul' })
  @IsString()
  @IsNotEmpty()
  arrivalCity: string | undefined;

  @ApiProperty({ example: 199.99 })
  @IsNumber()
  price: number | undefined;

  @ApiProperty({
    example: '2026-06-01T10:00:00Z',
    required: false,
  })
  @IsOptional()
  departureTime?: Date;

  @ApiProperty({
    example: '2026-06-01T12:30:00Z',
    required: false,
  })
  @IsOptional()
  arrivalTime?: Date;
}
