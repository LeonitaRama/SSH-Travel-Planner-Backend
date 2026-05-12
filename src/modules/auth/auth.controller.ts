import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthGuard } from '@nestjs/passport';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { ApiTags, ApiHeader, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiHeader({
    name: 'x-tenant-id',
    required: true,
    description: 'Tenant ID from GET /api/v1/tenants/slug/:slug',
  })
  async register(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: RegisterDto,
  ) {
    // Tenanti në header duhet të përputhet me tenantId në DTO
    if (tenantId !== dto.tenantId) {
      throw new BadRequestException(
        'Tenant ID mismatch between header and body',
      );
    }
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiHeader({ name: 'x-tenant-id', required: true })
  async login(@Headers('x-tenant-id') tenantId: string, @Body() dto: LoginDto) {
    if (!tenantId) {
      throw new BadRequestException('x-tenant-id header is required');
    }
    return this.authService.login(tenantId, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  @ApiBearerAuth()
  async profile(@Req() req: any) {
    return this.authService.getProfile(req.user.sub);
  }
}
