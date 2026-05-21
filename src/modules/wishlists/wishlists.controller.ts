import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiSecurity,
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiHeader,
} from '@nestjs/swagger';
import { WishlistsService } from './wishlists.service.js';
import { CreateWishlistDto } from './dto/create-wishlist.dto.js';
import { UpdateWishlistDto } from './dto/update-wishlist.dto.js';
import { TenantId } from '../../common/decorators/tenant.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { TenantGuard } from '../../common/guards/tenant.guard.js';
import { Role } from '../../common/enums/role.enum.js';

@ApiTags('Wishlists')
@ApiBearerAuth('JWT-auth')
@ApiSecurity('tenant-id')
@Controller('wishlists')
@UseGuards(AuthGuard('jwt'), RolesGuard, TenantGuard)
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Add a destination to wishlist' })
  async create(@TenantId() tenantId: string, @Body() dto: CreateWishlistDto) {
    return this.wishlistsService.create(tenantId, dto);
  }

  @Get()
  @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all wishlist items for current tenant' })
  async findAll(@TenantId() tenantId: string) {
    return this.wishlistsService.findAll(tenantId);
  }

  @Get(':id')
  @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get a wishlist item by ID' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.wishlistsService.findOne(tenantId, id);
  }

  @Patch(':id')
  @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update a wishlist item' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateWishlistDto,
  ) {
    return this.wishlistsService.update(tenantId, id, dto);
  }

  @Delete(':id')
  @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Remove a destination from wishlist' })
  async remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.wishlistsService.remove(tenantId, id);
  }
}
