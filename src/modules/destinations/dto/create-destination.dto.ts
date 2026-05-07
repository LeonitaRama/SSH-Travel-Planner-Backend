import { IsString, IsOptional } from 'class-validator';

export class CreateDestinationDto {
  @IsString()
  name!: string;

  @IsString()
  country!: string;

  @IsOptional()
  @IsString()
  description?: string;
}