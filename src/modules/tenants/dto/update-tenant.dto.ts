import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateTenantDto {
  @ApiPropertyOptional({ example: 'Updated Agency Name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'updated-agency-slug' })
  @IsString()
  @IsOptional()
  slug?: string;
}