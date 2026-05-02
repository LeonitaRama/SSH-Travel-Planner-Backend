import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './modules/prisma/prisma.module.js';
import { TenantsModule } from './modules/tenants/tenants.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { TenantMiddleware } from './common/middleware/tenant.middleware.js';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    TenantsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      // Përjashtojmë krijimin e agjencive të reja nga middleware nëse duam
      // .exclude({ path: 'tenants', method: RequestMethod.POST })
      .exclude(
        { path: '', method: RequestMethod.GET },
        { path: 'api', method: RequestMethod.ALL },
        { path: 'api/', method: RequestMethod.ALL },
        { path: 'api/v1/tenants', method: RequestMethod.ALL },
        { path: 'api/v1/tenants/:slug', method: RequestMethod.GET },
      )

      // E aplikojmë te të gjitha rrugët e tjera
      .forRoutes('*');
  }
}
