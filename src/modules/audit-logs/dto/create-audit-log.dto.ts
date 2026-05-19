import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAuditLogDto {
  @ApiProperty({ example: 'CREATE_BOOKING' })
  @IsString()
  @IsNotEmpty()
  action: string | undefined;

  @ApiProperty({ example: 'User created a booking' })
  @IsString()
  @IsNotEmpty()
  message: string | undefined;

  @ApiProperty({ example: 'SUCCESS', required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ example: 'user-id', required: false })
  @IsString()
  @IsOptional()
  userId?: string;
}
