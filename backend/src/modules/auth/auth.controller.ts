
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
  ApiSecurity, // Shto këtë import
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // ============================================
  // POST /auth/register - Regjistrim i ri
  // ============================================
  @Public()
  @Post('register')
  @ApiSecurity('tenant-id') // <--- Lidhet me butonin global Authorize për tenant-id
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Regjistron një përdorues të ri në një tenant specifik',
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid tenant ID or missing header',
  })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  @ApiResponse({
    status: 409,
    description: 'User already exists in this tenant',
  })
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
  // ============================================
  @Public()
  @Post('login')
  @ApiSecurity('tenant-id') // <--- Lidhet me butonin global Authorize për tenant-id
  @ApiOperation({
    summary: 'Login user',
    description: 'Autentikon përdoruesin dhe kthen access token',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  @HttpCode(HttpStatus.OK)
  async login(@Headers('x-tenant-id') tenantId: string, @Body() dto: LoginDto) {
    if (!tenantId) {
      throw new BadRequestException('x-tenant-id header is required');
    }
    return this.authService.login(tenantId, dto);
  }

  // ============================================
  // GET /auth/profile - Profili im
  // ============================================
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth') // Merr tokenin nga Authorize global
  @ApiSecurity('tenant-id') // Merr tenant-id nga Authorize global
  @ApiOperation({
    summary: 'Get user profile',
    description: 'Merr profilin e përdoruesit të autentikuar',
  })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient role' })
  async profile(@Req() req: any) {
    return this.authService.getProfile(req.user.sub);
  }

  // ============================================
  // POST /auth/logout - Dalje nga sistemi
  // ============================================
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('tenant-id')
  @ApiOperation({
    summary: 'Logout user',
    description: 'Fshin refresh token-in e përdoruesit dhe kryen logout',
  })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: any) {
    return this.authService.logout(req.user.sub);
  }

  // ============================================
  // POST /auth/refresh-token - Rifresko token-in
  // ============================================
  @Public()
  @Post('refresh-token')
  @ApiOperation({
    summary: 'Refresh access token',
    description:
      'Gjeneron një access token të ri duke përdorur refresh token-in',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: {
          type: 'string',
          description: 'Refresh token i marrë gjatë login ose register',
          example: '75380d8f2389302eb91ff4c749630faf...',
        },
      },
      required: ['refreshToken'],
    },
  })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Refresh token is required',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or expired refresh token',
  })
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }
    return this.authService.refreshToken(refreshToken);
  }
}
