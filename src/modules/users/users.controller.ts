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
import {
  ApiSecurity,
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { TenantId } from '../../common/decorators/tenant.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { TenantGuard } from '../../common/guards/tenant.guard.js';
import { Role } from '../../common/enums/role.enum.js';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@ApiSecurity('tenant-id')
@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard, TenantGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ============================================
  // GET /users - Listo të gjithë user-at e tenantit
  // ============================================
  @Get()
  @Roles(Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN) // PËRMIRËSIM: Edhe STAFF mund të shohë listën e user-ave (p.sh. klientët e agjencisë)
  @ApiOperation({ summary: 'Get all users for current tenant' })
  @ApiResponse({
    status: 200,
    description: 'List of users retrieved successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient role' })
  async findAll(@TenantId() tenantId: string) {
    return this.usersService.findAllByTenant(tenantId);
  }

  // ============================================
  // GET /users/:id - Gjej user-in sipas ID
  // ============================================
  @Get(':id')
  @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - You can only view your own profile',
  })
  async findOne(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Req() req: any,
  ) {
    // CUSTOMER dhe STAFF mund të shohin VETËM veten e tyre
    if (
      (req.user.role === Role.CUSTOMER || req.user.role === Role.STAFF) &&
      req.user.sub !== id
    ) {
      throw new ForbiddenException('You can only view your own profile');
    }
    return this.usersService.findOne(tenantId, id);
  }

  // ============================================
  // POST /users - Krijo user të ri brenda Tenant-it
  // ============================================
  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN) // KORRIGJIM: Lejo ADMIN-in e agjencisë të krijojë punëtorë/klientë
  @ApiOperation({ summary: 'Create new user for this tenant' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only Admin or Super Admin can create users',
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@TenantId() tenantId: string, @Body() dto: CreateUserDto) {
    return this.usersService.create(tenantId, dto);
  }

  // ============================================
  // PATCH /users/:id - Përditëso user-in
  // ============================================
  @Patch(':id')
  @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Action not allowed' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Req() req: any,
  ) {
    const isOwner = req.user.sub === id;
    const isAtLeastAdmin =
      req.user.role === Role.ADMIN || req.user.role === Role.SUPER_ADMIN;

    // 1. CUSTOMER dhe STAFF mund të editojnë VETËM veten e tyre
    if (!isAtLeastAdmin && !isOwner) {
      throw new ForbiddenException('You can only update your own profile');
    }

    // 2. KORRIGJIM I SIGURISË: Vetëm Admin/Super Admin mund të ndryshojnë rolet
    if (dto.role && !isAtLeastAdmin) {
      throw new ForbiddenException(
        'Only Administrators can assign or change roles',
      );
    }

    // 3. Sigurohemi që as Admini nuk i heq dot rolin vetes gabimisht
    if (dto.role && isOwner && req.user.role !== Role.SUPER_ADMIN) {
      throw new ForbiddenException('You cannot change your own role');
    }

    return this.usersService.update(tenantId, id, dto);
  }

  // ============================================
  // DELETE /users/:id - Fshi user-in
  // ============================================
  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN) // KORRIGJIM: Admini i agjencisë duhet të mund të fshijë një user të tenantit të vet
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Requires Admin privileges',
  })
  @HttpCode(HttpStatus.OK)
  async remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.usersService.remove(tenantId, id);
  }

  // ============================================
  // GET /users/profile/me - Merr profilin tim aktual
  // ============================================
  @Get('profile/me')
  @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  async getProfile(@TenantId() tenantId: string, @Req() req: any) {
    return this.usersService.findOne(tenantId, req.user.sub);
  }
}
