// src/app.module.ts (i plotësuar me middleware)
import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './modules/prisma/prisma.module.js';
import { TenantsModule } from './modules/tenants/tenants.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
// import { TenantMiddleware } from './common/middleware/tenant.middleware.js';
import { DestinationsModule } from './modules/destinations/destinations.module.js';
import { RolesGuard } from './common/guards/roles.guard.js';
import { LoggingMiddleware } from './common/middleware/logging.middleware.js';
import { RateLimitMiddleware } from './common/middleware/rate-limit.middleware.js';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard.js';
import { HotelsModule } from './modules/hotels/hotels.module.js';
import { RoomsModule } from './modules/rooms/rooms.module.js';
import { FlightsModule } from './modules/flights/flights.module.js';
import { BookingsModule } from './modules/bookings/bookings.module.js';
import { BookingItemsModule } from './modules/booking-items/booking-items.module.js';
import { PaymentsModule } from './modules/payments/payments.module.js';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module.js';
import { ReviewsModule } from './modules/reviews/reviews.module.js';
import { NotificationsModule } from './modules/notifications/notifications.module.js';
import { TravelPackagesModule } from './modules/travel-packages/travel-packages.module.js';
import { CacheModule } from '@nestjs/cache-manager';
import { AirlinesModule } from './modules/airlines/airlines.module.js';
import { AirportsModule } from './modules/airports/airports.module.js';
import { ActivitiesModule } from './modules/activities/activities.module.js';
import { WishlistsModule } from './modules/wishlists/wishlists.module.js';
import { TenantSettingsModule } from './modules/tenant-settings/tenant-settings.module.js';
import { CouponsModule } from './modules/coupons/coupons.module.js';
import { AiModule } from './modules/ai/ai.module.js';
import * as redisStore from 'cache-manager-redis-store';
import { AdminModule } from './modules/admin/admin.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 6000,
    }),
    AuthModule,
    ScheduleModule.forRoot(),
    PrismaModule,
    TenantsModule,
    UsersModule,
    DestinationsModule,
    HotelsModule,
    AirportsModule,
    AirlinesModule,
    FlightsModule,
    RoomsModule,
    BookingsModule,
    PaymentsModule,
    ReviewsModule,
    WishlistsModule,
    CouponsModule,
    NotificationsModule,
    TravelPackagesModule,
    AiModule,
    AdminModule,
    AuditLogsModule,
    ActivitiesModule,
    TenantSettingsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // Autentikimi global
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard, // Autorizimi global
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware, RateLimitMiddleware)
      .exclude(
        { path: '/', method: RequestMethod.GET },
        { path: 'api', method: RequestMethod.GET },
        { path: 'api/*path', method: RequestMethod.GET },
        { path: 'api/v1/tenants', method: RequestMethod.POST },
        { path: 'api/v1/tenants', method: RequestMethod.GET },
        { path: 'api/v1/tenants/slug/:slug', method: RequestMethod.GET },
        { path: 'auth/register', method: RequestMethod.POST },
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/refresh-token', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
