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
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthGuard } from '@nestjs/passport';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { ApiTags, ApiHeader, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../modules/auth/enums/role.enum.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { Public } from '../../common/decorators/public.decorator.js';

@ApiTags('Auth')
@Controller('auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiHeader({
    name: 'x-tenant-id',
    required: true,
    description: 'Tenant ID',
  })
  async register(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: RegisterDto,
  ) {
    if (tenantId !== dto.tenantId) {
      throw new BadRequestException(
        'Tenant ID mismatch between header and body',
      );
    }
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @ApiHeader({ name: 'x-tenant-id', required: true })
  async login(@Headers('x-tenant-id') tenantId: string, @Body() dto: LoginDto) {
    if (!tenantId) {
      throw new BadRequestException('x-tenant-id header is required');
    }
    return this.authService.login(tenantId, dto);
  }

  @Get('profile')
  @ApiBearerAuth()
  async profile(@Req() req: any) {
    return this.authService.getProfile(req.user.sub);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.TENANT_ADMIN)
  @Get('users')
  @ApiBearerAuth()
  async getAllUsers(@Req() req: any) {
    return this.authService.getAllUsers(req.user.tenantId, req.user.role);
  }

  @Roles(Role.SUPER_ADMIN)
  @Get('tenants')
  @ApiBearerAuth()
  async getAllTenants() {
    return this.authService.getAllTenants();
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.TENANT_ADMIN)
  @Post('users/:userId/role')
  @ApiBearerAuth()
  async changeUserRole(
    @Req() req: any,
    @Param('userId') userId: string,
    @Body('role') role: Role,
  ) {
    return this.authService.changeUserRole(userId, role, req.user);
  }
}
