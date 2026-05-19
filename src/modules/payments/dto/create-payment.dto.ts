import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ example: 299.99 })
  @IsNumber()
  amount!: number;

  @ApiProperty({ example: 'EUR' })
  @IsString()
  @IsNotEmpty()
  currency!: string;

  @ApiProperty({ example: 'COMPLETED' })
  @IsString()
  @IsNotEmpty()
  status!: string;

  @ApiProperty()
  @IsUUID()
  bookingId!: string;
}
