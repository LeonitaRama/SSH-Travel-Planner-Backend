import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAirlineDto {
  @ApiProperty({ example: 'Turkish Airlines' })
    @IsString()
    @IsNotEmpty()
    name!: string;

  @ApiProperty({
        example: 'TK',
        description: 'Unique IATA code for the airline per tenant',
    })
    @IsString()
    @IsNotEmpty()
    code!: string;

  @ApiProperty({ example: 'Turkey' })
    @IsString()
    @IsNotEmpty()
    country!: string;
}
