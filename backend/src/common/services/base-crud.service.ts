import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseTenantService } from './base-tenant.service.js';
import { PrismaService } from '../../modules/prisma/prisma.service.js';

export interface CrudOptions {
  modelName: string;
  defaultSelect?: any;
  defaultInclude?: any;
}

@Injectable()
export abstract class BaseCrudService<
  T,
  CreateDto,
  UpdateDto,
> extends BaseTenantService {
  constructor(
    protected prismaService: PrismaService,
    protected options: CrudOptions,
  ) {
    super(prismaService);
  }

  async create(tenantId: string, dto: CreateDto): Promise<T> {
    return (this.prisma as any)[this.options.modelName].create({
      data: { ...dto, tenantId } as any,
      ...(this.options.defaultSelect && { select: this.options.defaultSelect }),
      ...(this.options.defaultInclude && {
        include: this.options.defaultInclude,
      }),
    });
  }

  async findAll(tenantId: string, filters?: any): Promise<T[]> {
    return (this.prisma as any)[this.options.modelName].findMany({
      where: { tenantId, ...filters },
      ...(this.options.defaultSelect && { select: this.options.defaultSelect }),
      ...(this.options.defaultInclude && {
        include: this.options.defaultInclude,
      }),
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string): Promise<T> {
    const resource = await (this.prisma as any)[
      this.options.modelName
    ].findFirst({
      where: { id, tenantId },
      ...(this.options.defaultSelect && { select: this.options.defaultSelect }),
      ...(this.options.defaultInclude && {
        include: this.options.defaultInclude,
      }),
    });

    if (!resource) {
      throw new NotFoundException(
        `${this.options.modelName} with ID ${id} not found`,
      );
    }
    return resource;
  }

  async update(tenantId: string, id: string, dto: UpdateDto): Promise<T> {
    await this.findOne(tenantId, id); // siguron që ekziston

    return (this.prisma as any)[this.options.modelName].update({
      where: { id },
      data: dto as any,
      ...(this.options.defaultSelect && { select: this.options.defaultSelect }),
    });
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);

    await (this.prisma as any)[this.options.modelName].delete({
      where: { id },
    });

    return { message: `${this.options.modelName} deleted successfully`, id };
  }
}
