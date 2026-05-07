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
      .exclude(
        { path: '/', method: RequestMethod.GET }, // Përjashton faqen kryesore
        { path: 'api', method: RequestMethod.GET }, // Përjashton Swagger-in
        { path: 'api/(.*)', method: RequestMethod.GET }, // Përjashton asetet e Swagger
        { path: 'api/v1/tenants', method: RequestMethod.POST }, // Lejon krijimin e tenantit
        { path: 'api/v1/tenants/slug/:slug', method: RequestMethod.GET },
      )
      .forRoutes('*');
  }
}
