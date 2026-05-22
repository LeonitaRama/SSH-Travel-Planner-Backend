import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { BaseCrudService } from '../../common/services/base-crud.service.js';
import { CreateCouponDto } from './dto/create-coupon.dto.js';
import { UpdateCouponDto } from './dto/update-coupon.dto.js';
import { Coupon } from '@prisma/client';

@Injectable()
export class CouponsService extends BaseCrudService<
  Coupon,
  CreateCouponDto,
  UpdateCouponDto
> {
  constructor(protected prismaService: PrismaService) {
    super(prismaService, {
      modelName: 'coupon', // camelCase ekzakt si modeli në Prisma
    });
  }
}
