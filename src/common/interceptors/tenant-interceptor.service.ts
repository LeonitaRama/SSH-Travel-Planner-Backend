// src/common/interceptors/tenant.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from '../../modules/prisma/prisma.service.js';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    // 1. Sigurohu që kërkesa është HTTP (Parandalon gabimet nëse ka WebSockets/GraphQL)
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();

    // 2. Lejo dokumentacionin e Swagger pa bllokim dhe pa kontrolluar getHandler
    if (
      request.url &&
      (request.url.startsWith('/api') || request.url.includes('swagger'))
    ) {
      return next.handle();
    }

    // 3. Kusht mbrojtës për sigurinë e kontekstit
    if (
      typeof context.getHandler !== 'function' ||
      typeof context.getClass !== 'function'
    ) {
      return next.handle();
    }

    let tenantId = request.headers['x-tenant-id'];

    // Kontrollo nëse endpoint-i është publik
    const isPublic = this.isPublicEndpoint(context);
    if (!tenantId && !isPublic) {
      throw new BadRequestException('x-tenant-id header is required');
    }

    if (tenantId) {
      // Verifikon që tenant-i ekziston në databazë
      const tenant = await this.prisma.tenant.findUnique({
        where: { id: tenantId },
      });
      if (!tenant) {
        throw new BadRequestException(`Tenant with ID ${tenantId} not found`);
      }
      request.tenant = tenant;
      request.tenantId = tenant.id;
    }

    return next.handle();
  }

  private isPublicEndpoint(context: ExecutionContext): boolean {
    const handler = context.getHandler();
    const targetClass = context.getClass();

    // Nëse për ndonjë arsye handler-i apo klasa nuk ekzistojnë
    if (!handler || !targetClass) {
      return false;
    }

    const isPublic =
      Reflect.getMetadata('isPublic', handler) ||
      Reflect.getMetadata('isPublic', targetClass);
    return !!isPublic;
  }
}
