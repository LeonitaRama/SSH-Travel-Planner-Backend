// src/common/guards/tenant.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../modules/prisma/prisma.service.js';
import { Role } from '../enums/role.enum.js'; // <- SHTONI KËTË

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const tenantId = request.headers['x-tenant-id'];

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Verifikon që user-i i përket tenant-it të kërkuar
    if (user.tenantId !== tenantId && user.role !== Role.SUPER_ADMIN) {
      throw new ForbiddenException('Access denied to this tenant');
    }

    return true;
  }
}
