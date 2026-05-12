// src/modules/auth/dto/register.dto.ts
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../common/enums/role.enum.js';

export class RegisterDto {
  @ApiProperty({ example: 'john_doe' })
  @IsNotEmpty()
  @IsString()
  username!: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  tenantId!: string;

  @ApiProperty({ enum: Role, default: Role.CUSTOMER, required: false })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
