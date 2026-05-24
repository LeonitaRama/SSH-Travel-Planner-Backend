import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateTenantSettingsDto {
  @ApiProperty({ example: 'dark', required: false })
  @IsString()
  @IsOptional()
  theme?: string;
}