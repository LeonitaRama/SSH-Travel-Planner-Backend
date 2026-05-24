// import {
//   Injectable,
//   NestMiddleware,
//   BadRequestException,
//   NotFoundException,
//   Logger,
// } from '@nestjs/common';
// import { PrismaService } from '../../modules/prisma/prisma.service.js';

// @Injectable()
// export class TenantMiddleware implements NestMiddleware {
//   private logger = new Logger('TenantMiddleware');

//   constructor(private prisma: PrismaService) {}

//   async use(req: any, res: any, next: () => void) {
//     const tenantId = req.headers['x-tenant-id'];
//     const startTime = Date.now();

//     this.logger.debug(`Validating tenant: ${tenantId}`);

//     if (!tenantId) {
//       this.logger.warn('Missing x-tenant-id header');
//       throw new BadRequestException(
//         'Tenant ID header (x-tenant-id) is required',
//       );
//     }

//     // Validimi i UUID formatit
//     const uuidRegex =
//       /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
//     if (!uuidRegex.test(tenantId)) {
//       this.logger.warn(`Invalid tenant ID format: ${tenantId}`);
//       throw new BadRequestException('Invalid tenant ID format');
//     }

//     const tenant = await this.prisma.tenant.findUnique({
//       where: { id: tenantId },
//     });

//     if (!tenant) {
//       this.logger.warn(`Tenant not found: ${tenantId}`);
//       throw new NotFoundException(`Tenant with ID "${tenantId}" not found`);
//     }

//     req.tenant = tenant;
//     req.tenantId = tenant.id;

//     const duration = Date.now() - startTime;
//     this.logger.debug(
//       `Tenant validated: ${tenant.name} (${tenant.id}) - ${duration}ms`,
//     );

//     next();
//   }
// }
