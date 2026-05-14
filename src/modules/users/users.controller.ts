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
  ApiHeader,
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
@ApiBearerAuth('JWT-auth') // ← E RËNDËSISHME: Shto këtë
@ApiSecurity('tenant-id')
@ApiHeader({
  name: 'x-tenant-id',
  required: true,
  description: 'Tenant ID (UUID format)',
})
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
  @ApiResponse({
    status: 200,
    description: 'List of users retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient role' })
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
  @ApiResponse({ status: 200, description: 'User found successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - You can only view your own profile',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Req() req: any,
  ) {
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
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only SUPER_ADMIN can create users',
  })
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
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Cannot update other users or change own role',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Req() req: any,
  ) {
    if (
      (req.user.role === Role.CUSTOMER || req.user.role === Role.STAFF) &&
      req.user.sub !== id
    ) {
      throw new ForbiddenException('You can only update your own profile');
    }

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
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only SUPER_ADMIN can delete users',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @HttpCode(HttpStatus.OK)
  async remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.usersService.remove(tenantId, id);
  }

  @Get('profile/me')
  @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@TenantId() tenantId: string, @Req() req: any) {
    return this.usersService.findOne(tenantId, req.user.sub);
  }
}
