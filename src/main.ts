import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { TenantInterceptor } from './common/interceptors/tenant-interceptor.service.js';
import { PrismaService } from './modules/prisma/prisma.service.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Konfigurimi i CORS - vetëm NJË herë
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'], // Frontend URL-të
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'x-tenant-id'],
    exposedHeaders: ['Authorization'],
  });

  app.setGlobalPrefix('');

  app.useGlobalInterceptors(new TenantInterceptor(app.get(PrismaService)));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('SSH Travel Planner API')
    .setDescription('API documentation for SSH Travel Planner Backend')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter your JWT token here',
        in: 'header',
      },
      'JWT-auth',
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-tenant-id',
        in: 'header',
        description:
          'Tenant ID (UUID format) - Required for all requests except refresh-token',
      },
      'tenant-id',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
      tryItOutEnabled: true,
    },
  });

  await app.listen(3000);
  console.log(`🚀 Server running on http://localhost:3000`);
  console.log(`📚 Swagger docs: http://localhost:3000/api`);
}

bootstrap();
