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
} from '@nestjs/swagger';

import { ReviewsService } from './reviews.service.js';

import { CreateReviewDto } from './dto/create-review.dto.js';
import { UpdateReviewDto } from './dto/update-review.dto.js';

import { TenantId } from '../../common/decorators/tenant.decorator.js';

import { Roles } from '../../common/decorators/roles.decorator.js';

import { RolesGuard } from '../../common/guards/roles.guard.js';
import { TenantGuard } from '../../common/guards/tenant.guard.js';

import { Role } from '../../common/enums/role.enum.js';

@ApiTags('Reviews')
@ApiBearerAuth('JWT-auth')
@ApiSecurity('tenant-id')
@Controller('reviews')
@UseGuards(AuthGuard('jwt'), RolesGuard, TenantGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @Roles(Role.CUSTOMER, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create review' })
  async create(@TenantId() tenantId: string, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(tenantId, dto);
  }

  @Get()
  @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all reviews' })
  async findAll(@TenantId() tenantId: string) {
    return this.reviewsService.findAll(tenantId);
  }

  @Get(':id')
  @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get review by ID' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.reviewsService.findOne(tenantId, id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update review' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(tenantId, id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete review' })
  async remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.reviewsService.remove(tenantId, id);
  }
}
