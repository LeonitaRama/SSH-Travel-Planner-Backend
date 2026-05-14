import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../modules/prisma/prisma.service.js';

@Injectable()
export abstract class BaseTenantService {
  constructor(protected readonly prisma: PrismaService) {}

  protected async verifyTenantOwnership(
    tenantId: string,
    resourceId: string,
    model: string,
  ): Promise<boolean> {
    switch (model) {
      case 'user':
        const user = await this.prisma.user.findFirst({
          where: { id: resourceId, tenantId },
        });
        return !!user;
      // Shto modele të tjera kur të krijosh (booking, etc.)
      default:
        return false;
    }
  }
}
