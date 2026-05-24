import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getGlobalStats() {
    const [
      totalUsers,
      totalTenants,
      totalBookings,
      activeBookings,
      cancelledBookings,
      revenueAgg,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.tenant.count(),
      this.prisma.booking.count(),
      this.prisma.booking.count({ where: { status: 'CONFIRMED' } }),
      this.prisma.booking.count({ where: { status: 'CANCELLED' } }),
      this.prisma.payment.aggregate({
        _sum: { amount: true },
      }),
    ]);

    return {
      totalUsers,
      totalTenants,
      totalBookings,
      activeBookings,
      cancelledBookings,
      totalRevenue: revenueAgg._sum.amount || 0,
    };
  }

  async getTenantStats(tenantId: string) {
    const [
      users,
      bookings,
      revenueAgg,
      destinations,
    ] = await Promise.all([
      this.prisma.user.count({ where: { tenantId } }),
      this.prisma.booking.count({ where: { tenantId } }),
      this.prisma.payment.aggregate({
        where: { tenantId },
        _sum: { amount: true },
      }),
      this.prisma.destination.count({ where: { tenantId } }),
    ]);

    return {
      tenantId,
      users,
      bookings,
      destinations,
      revenue: revenueAgg._sum.amount || 0,
    };
  }

  async getBookingTrend(tenantId?: string) {
    const bookings = await this.prisma.booking.findMany({
      where: tenantId ? { tenantId } : {},
      select: {
        createdAt: true,
        status: true,
      },
    });

    return bookings;
  }
}