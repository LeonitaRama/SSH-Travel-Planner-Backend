// src/modules/users/dto/update-user.dto.ts
import { PartialType, ApiProperty } from '@nestjs/swagger'; // Ndryshuar importi këtu
import { CreateUserDto } from './create-user.dto.js';
import {
  IsOptional,
  IsString,
  MinLength,
  IsEmail,
  IsEnum,
} from 'class-validator';
import { Role } from '../../../common/enums/role.enum.js';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'newemail@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'newpassword123', minLength: 6, required: false })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({ enum: Role, required: false })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
