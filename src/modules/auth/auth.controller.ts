// src/modules/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Headers,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../common/enums/role.enum.js';
import { Public } from '../../common/decorators/public.decorator.js';
import {
  ApiTags,
  ApiHeader,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // ============================================
  // POST /auth/register - Regjistrim i ri
  // Public endpoint - nuk kërkon autentikim
  // ============================================
  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid tenant ID' })
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: RegisterDto,
  ) {
    if (!tenantId) {
      throw new BadRequestException('x-tenant-id header is required');
    }

    if (tenantId !== dto.tenantId) {
      throw new BadRequestException(
        'Tenant ID mismatch between header and body',
      );
    }

    return this.authService.register(dto);
  }

  // ============================================
  // POST /auth/login - Hyrje në sistem
  // Public endpoint - nuk kërkon autentikim
  // ============================================
  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @HttpCode(HttpStatus.OK)
  async login(@Headers('x-tenant-id') tenantId: string, @Body() dto: LoginDto) {
    if (!tenantId) {
      throw new BadRequestException('x-tenant-id header is required');
    }
    return this.authService.login(tenantId, dto);
  }

  // ============================================
  // GET /auth/profile - Profili im
  // Vetëm user-at e autentikuar
  // ============================================
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  async profile(@Req() req: any) {
    return this.authService.getProfile(req.user.sub);
  }

  // ============================================
  // POST /auth/logout - Dalje nga sistemi
  // Vetëm user-at e autentikuar
  // ============================================
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: any) {
    return this.authService.logout(req.user.sub);
  }

  // ============================================
  // POST /auth/refresh-token - Rifresko token-in
  // Public endpoint - merr refresh token
  // ============================================
  @Public()
  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access token' })
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
