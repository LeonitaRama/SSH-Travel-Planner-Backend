// src/modules/tenants/dto/create-tenant.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

export class CreateTenantDto {
  @ApiProperty({
    description: 'Emri i agjencisë/tenant-it',
    example: 'Test Agency',
  })
  @IsString()
  @IsNotEmpty()
  name!: string; // <--- Shto "!" këtu

  @ApiProperty({
    description: 'Slug unik për URL-në e agjencisë',
    example: 'test-agency',
  })
  @IsString()
  @IsNotEmpty()
  slug!: string; // <--- Shto "!" këtu

  @ApiProperty({
    description: 'Username për Adminin e parë të agjencisë',
    example: 'admin_test',
  })
  @IsString()
  @IsNotEmpty()
  adminUsername!: string; // <--- Shto "!" këtu

  @ApiProperty({
    description: 'Email adresë për Adminin',
    example: 'admin@testagency.com',
  })
  @IsEmail()
  adminEmail!: string; // <--- Shto "!" këtu

  @ApiProperty({
    description: 'Fjalëkalimi për Adminin',
    example: 'SecurePass123!',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  adminPassword!: string; // <--- Shto "!" këtu
}