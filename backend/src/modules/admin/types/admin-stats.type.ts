// types/admin-stats.type.ts
export type AdminStats = {
  totalUsers: number;
  totalTenants: number;
  totalBookings: number;
  totalRevenue: number;
  activeBookings: number;
  cancelledBookings: number;
};