import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TenantsService } from './tenants.service.js';
import { CreateTenantDto } from './dto/create-tenant.dto.js';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../common/enums/role.enum.js';
import { Public } from '../../common/decorators/public.decorator.js'; // Sigurohu që ky dekorator ekziston
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UpdateTenantDto } from './dto/update-tenant.dto.js';

@ApiBearerAuth('JWT-auth')
// Këtu u hoq @ApiSecurity('tenant-id') sepse Super Admin-i menaxhon krejt sistemin global, nuk i duhet x-tenant-id në header për këto operacione
// @UseGuards(AuthGuard('jwt'), RolesGuard)
@UseGuards(RolesGuard)
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN) // <--- E SHTUAR: Tani Luna (CUSTOMER) do të bllokohet menjëherë me 403
  @ApiOperation({ summary: 'Create a new tenant (Super Admin only)' })
  @ApiResponse({ status: 201, description: 'Tenant created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid input' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires SUPER_ADMIN' })
  create(@Body() dto: CreateTenantDto) {
    return this.tenantsService.create(dto);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN) // <--- E SHTUAR: Vetëm Super Admin mund t'i shohë të gjithë tenantët
  @ApiOperation({ summary: 'Get all tenants (Super Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of tenants retrieved successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - requires SUPER_ADMIN' })
  findAll() {
    return this.tenantsService.findAll();
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN) // <--- E SHTUAR: Vetëm Super Admin mund të kërkojë sipas ID-së specifike globale
  @ApiOperation({ summary: 'Get tenant by ID (Super Admin only)' })
  @ApiResponse({ status: 200, description: 'Tenant retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires SUPER_ADMIN' })
  findOne(@Param('id') id: string) {
    return this.tenantsService.findOne(id);
  }

  // Frontend-i e përdor këtë për të marrë ID nga slug PARA se përdoruesi të ketë bërë login
  @Public() // <--- E SHTUAR: Heq nevojën për JWT token dhe lejon frontend-in të qaset lirisht
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get tenant by slug (Public)' })
  @ApiResponse({ status: 200, description: 'Tenant retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  findBySlug(@Param('slug') slug: string) {
    return this.tenantsService.findBySlug(slug);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update tenant by ID' })
  @ApiBody({ type: UpdateTenantDto })
  @ApiResponse({ status: 200, description: 'Tenant updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires SUPER_ADMIN' })
  async update(@Param('id') id: string, @Body() dto: UpdateTenantDto) {
    return this.tenantsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete tenant by ID' })
  @ApiResponse({ status: 200, description: 'Tenant deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires SUPER_ADMIN' })
  async remove(@Param('id') id: string) {
    return this.tenantsService.remove(id);
  }
}
