// src/app.module.ts (i plotësuar me middleware)
import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
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
import { BookingItemsModule } from './modules/booking-items/booking-items.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    TenantsModule,
    UsersModule,
    AuthModule,
    DestinationsModule,
    HotelsModule,
    RoomsModule,
    FlightsModule,
    BookingsModule,
    BookingItemsModule,
    PaymentsModule,
    feature/audit-logs
    AuditLogsModule,
    BookingItemsModule,

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
