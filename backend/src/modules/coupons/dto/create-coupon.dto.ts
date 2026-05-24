import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreateCouponDto {
  @ApiProperty({ example: 'VARA2026' })
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiProperty({
    example: 15.0,
    description: 'Discount percentage (e.g. 15 for 15%)',
  })
  @IsNumber()
  @IsNotEmpty()
  discount!: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: '2026-08-31T23:59:59.000Z' })
  @IsDateString()
  @IsNotEmpty()
  expiresAt!: string;
}
