import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../modules/prisma/prisma.service.js';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: any, res: any, next: () => void) {
    const slug = req.headers['x-tenant-slug'];

    if (!slug) {
      throw new NotFoundException('Tenant header missing');
    }

    const tenant = await this.prisma.tenant.findUnique({
      where: { slug },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    // attach tenant to request
    req.tenant = tenant;

    next();
  }
}
