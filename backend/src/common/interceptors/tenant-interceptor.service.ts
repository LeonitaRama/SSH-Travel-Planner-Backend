// src/common/interceptors/tenant.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from '../../modules/prisma/prisma.service.js';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  private logger = new Logger('TenantInterceptor');

  constructor(private prisma: PrismaService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const startTime = Date.now();

    if (
      request.url &&
      (request.url.startsWith('/api-docs') || request.url.includes('swagger'))
    ) {
      return next.handle();
    }

    if (
      typeof context.getHandler !== 'function' ||
      typeof context.getClass !== 'function'
    ) {
      return next.handle();
    }

    const tenantId = request.headers['x-tenant-id'];
    const isPublic = this.isPublicEndpoint(context);

    // SHTONI KËTË: Merr përdoruesin aktual nga kërkesa (nëse ekziston)
    const user = request.user;
    const isSuperAdmin = user && user.role === 'SUPER_ADMIN';

    // 1. PËRDITËSIMI: Nëse mungon header-i, nuk është rrugë publike DHE nuk është Super Admin
    if (!tenantId && !isPublic && !isSuperAdmin) {
      this.logger.warn(
        `Missing x-tenant-id header on protected route: ${request.url}`,
      );
      throw new BadRequestException(
        'Tenant ID header (x-tenant-id) is required',
      );
    }

    // 2. Nëse ekziston tenantId, e validojmë (Kjo mbetet e njëjtë)
    if (tenantId) {
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(tenantId)) {
        this.logger.warn(`Invalid tenant ID format: ${tenantId}`);
        throw new BadRequestException('Invalid tenant ID format');
      }

      const tenant = await this.prisma.tenant.findUnique({
        where: { id: tenantId },
      });

      if (!tenant) {
        this.logger.warn(`Tenant not found in DB: ${tenantId}`);
        throw new NotFoundException(`Tenant with ID "${tenantId}" not found`);
      }

      request.tenant = tenant;
      request.tenantId = tenant.id;

      const duration = Date.now() - startTime;
      this.logger.debug(
        `Tenant validated: ${tenant.name} (${tenant.id}) - ${duration}ms`,
      );
    }

    return next.handle();
  }

  private isPublicEndpoint(context: ExecutionContext): boolean {
    const handler = context.getHandler();
    const targetClass = context.getClass();

    if (!handler || !targetClass) {
      return false;
    }

    const isPublic =
      Reflect.getMetadata('isPublic', handler) ||
      Reflect.getMetadata('isPublic', targetClass);
    return !!isPublic;
  }
}
