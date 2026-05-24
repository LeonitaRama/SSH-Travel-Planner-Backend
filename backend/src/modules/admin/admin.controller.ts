import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../common/enums/role.enum.js';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard.js';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  getGlobalStats() {
    return this.adminService.getGlobalStats();
  }

  @Get('tenant/:tenantId/stats')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  getTenantStats(tenantId: string) {
    return this.adminService.getTenantStats(tenantId);
  }

  @Get('bookings-trend')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  getBookingTrend() {
    return this.adminService.getBookingTrend();
  }
}