// src/modules/admin/admin.controller.ts
import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AdminService } from './admin.service.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../common/enums/role.enum.js';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { TenantGuard } from '../../common/guards/tenant.guard.js';
import type { Request } from 'express';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard, TenantGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async getStats(@Req() req: Request) {
    const tenantId = req.headers['x-tenant-id'] as string;
    return this.adminService.getStatsForTenant(tenantId);
  }

  @Get('global-stats')
  @Roles(Role.SUPER_ADMIN)
  async getGlobalStats() {
    return this.adminService.getGlobalStats();
  }

  @Get('tenant-stats')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async getTenantStats(@Req() req: Request) {
    const tenantId = req.headers['x-tenant-id'] as string;
    return this.adminService.getStatsForTenant(tenantId);
  }

  // ✅ Added missing method to resolve TS2339
  @Get('booking-trend')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async getBookingTrend() {
    return this.adminService.getBookingTrend(); // Ensure this method also exists in AdminService
  }
}
