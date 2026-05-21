import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAirportDto {
  @ApiProperty({ example: 'Pristina International Airport' })
    @IsString()
    @IsNotEmpty()
    name!: string;

  @ApiProperty({ example: 'PRN', description: '3-letter IATA code' })
    @IsString()
    @IsNotEmpty()
    code!: string;

  @ApiProperty({ example: 'Pristina' })
    @IsString()
    @IsNotEmpty()
    city!: string;

  @ApiProperty({ example: 'Kosovo' })
    @IsString()
    @IsNotEmpty()
    country!: string;
}