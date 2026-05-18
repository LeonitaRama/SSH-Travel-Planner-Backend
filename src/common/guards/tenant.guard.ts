import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../modules/prisma/prisma.service.js';
import { Role } from '../enums/role.enum.js';

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

    // 1. Nëse është SUPER_ADMIN, lejoje të kalojë automatikisht kudo
    if (user.role === Role.SUPER_ADMIN) {
      return true;
    }

    // 2. Për rolet e tjera, header-i duhet të ekzistojë dhe të përputhet me tenantId e tyre
    if (!tenantId || user.tenantId !== tenantId) {
      throw new ForbiddenException('Access denied to this tenant');
    }

    return true;
  }
}
