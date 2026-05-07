import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Importi i ri
import { UserRole } from './role.enum.js';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address of the user',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'Password123!',
    minLength: 6,
    description: 'Secure password for the account',
  })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({
    enum: UserRole,
    required: false,
    default: UserRole.USER,
    description: 'Role assigned to the user',
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
