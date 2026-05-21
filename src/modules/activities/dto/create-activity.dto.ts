import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateActivityDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'ID of the Destination',
  })
  @IsUUID()
  @IsNotEmpty()
  destinationId!: string;

  @ApiProperty({ example: 'Eiffel Tower Guided Tour' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example:
      'Skip the line and enjoy a guided tour to the top of Eiffel Tower.',
  })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ example: 45.5 })
  @IsNumber()
  @IsNotEmpty()
  price!: number;

  @ApiProperty({ example: '2 hours' })
  @IsString()
  @IsNotEmpty()
  duration!: string;
}
