import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId!: string;

  // Shto këtë që të njihet nga UpdateNotificationDto automatikisht
  @ApiProperty({ required: false, default: false })
  @IsBoolean()
  @IsOptional()
  isRead?: boolean;
}
