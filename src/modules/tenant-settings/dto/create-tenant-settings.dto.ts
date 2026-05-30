// src/modules/tenant-settings/dto/create-tenant-settings.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsIn } from 'class-validator';

export class CreateTenantSettingsDto {
  @ApiProperty({ example: 'light', required: false, enum: ['light', 'dark'] })
  @IsString()
  @IsOptional()
  @IsIn(['light', 'dark'])
  theme?: string;

  @ApiProperty({ example: 'en', required: false })
  @IsString()
  @IsOptional()
  language?: string;

  @ApiProperty({ example: 'EUR', required: false })
  @IsString()
  @IsOptional()
  currency?: string;
}
