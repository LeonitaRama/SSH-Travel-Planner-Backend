// src/common/services/base-tenant.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../modules/prisma/prisma.service.js';

@Injectable()
export abstract class BaseTenantService {
  constructor(protected readonly prisma: PrismaService) {}

  protected validateTenantAccess(
    tenantId: string,
    resourceId: string,
  ): Promise<boolean> {
    throw new Error('Method not implemented');
  }

  protected async verifyTenantOwnership(
    tenantId: string,
    model: string,
    resourceId: string,
  ): Promise<boolean> {
    switch (model) {
      case 'user':
        const user = await this.prisma.user.findFirst({
          where: { id: resourceId, tenantId },
        });
        return !!user;
      default:
        return false;
    }
  }
}
