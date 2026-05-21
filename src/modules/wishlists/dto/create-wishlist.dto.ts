import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateWishlistDto {
  @ApiProperty({
    example: 'u1v2w3x4-y5z6-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'ID of the User',
  })
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @ApiProperty({
    example: 'd1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a',
    description: 'ID of the Destination',
  })
  @IsUUID()
  @IsNotEmpty()
  destinationId!: string;
}
