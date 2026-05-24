import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' }) // <- SHTONI
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'password123', minLength: 6 }) // <- SHTONI
  @MinLength(6)
  password!: string;
}
