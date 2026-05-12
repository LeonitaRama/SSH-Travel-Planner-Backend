// src/modules/users/users.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiSecurity, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { TenantId } from '../../common/decorators/tenant.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { TenantGuard } from '../../common/guards/tenant.guard.js';
import { Role } from '../../common/enums/role.enum.js'; // ← IMPORTI I RI
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@ApiHeader({ name: 'x-tenant-id', required: true })
@ApiSecurity('tenant-id')
@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard, TenantGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ============================================
  // GET /users - Listo të gjithë user-at
  // Vetëm ADMIN dhe SUPER_ADMIN
  // ============================================
  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all users for current tenant' })
  async findAll(@TenantId() tenantId: string) {
    return this.usersService.findAllByTenant(tenantId);
  }

  // ============================================
  // GET /users/:id - Gjej user-in sipas ID
  // ADMIN dhe SUPER_ADMIN mund të shohin këdo
  // CUSTOMER dhe STAFF mund të shohin vetëm veten
  // ============================================
  @Get(':id')
  @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get user by ID' })
  async findOne(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Req() req: any,
  ) {
    // Nëse user-i është CUSTOMER ose STAFF, mund të shohë vetëm veten
    if (
      (req.user.role === Role.CUSTOMER || req.user.role === Role.STAFF) &&
      req.user.sub !== id
    ) {
      throw new ForbiddenException('You can only view your own profile');
    }
    return this.usersService.findOne(tenantId, id);
  }

  // ============================================
  // POST /users - Krijo user të ri
  // Vetëm SUPER_ADMIN
  // ============================================
  @Post()
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create new user' })
  @HttpCode(HttpStatus.CREATED)
  async create(@TenantId() tenantId: string, @Body() dto: CreateUserDto) {
    return this.usersService.create(tenantId, dto);
  }

  // ============================================
  // PATCH /users/:id - Përditëso user-in
  // CUSTOMER dhe STAFF: vetëm veten
  // ADMIN dhe SUPER_ADMIN: mund të përditësojnë këdo
  // ============================================
  @Patch(':id')
  @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update user' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Req() req: any,
  ) {
    // CUSTOMER dhe STAFF mund të përditësojnë vetëm veten
    if (
      (req.user.role === Role.CUSTOMER || req.user.role === Role.STAFF) &&
      req.user.sub !== id
    ) {
      throw new ForbiddenException('You can only update your own profile');
    }

    // Nëse dikush provon të ndryshojë rolin e tij (përveç SUPER_ADMIN)
    if (dto.role && req.user.sub === id && req.user.role !== Role.SUPER_ADMIN) {
      throw new ForbiddenException('You cannot change your own role');
    }

    return this.usersService.update(tenantId, id, dto);
  }

  // ============================================
  // DELETE /users/:id - Fshi user-in
  // Vetëm SUPER_ADMIN
  // ============================================
  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete user' })
  @HttpCode(HttpStatus.OK)
  async remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.usersService.remove(tenantId, id);
  }

  // ============================================
  // GET /users/profile/me - Profili im
  // Të gjithë user-at e autentikuar
  // ============================================
  @Get('profile/me')
  @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@TenantId() tenantId: string, @Req() req: any) {
    return this.usersService.findOne(tenantId, req.user.sub);
  }
}
