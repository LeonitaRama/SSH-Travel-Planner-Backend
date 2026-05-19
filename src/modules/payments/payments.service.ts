import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

import { BaseCrudService } from '../../common/services/base-crud.service.js';

import { CreatePaymentDto } from './dto/create-payment.dto.js';
import { UpdatePaymentDto } from './dto/update-payment.dto.js';

@Injectable()
export class PaymentsService extends BaseCrudService<
  any,
  CreatePaymentDto,
  UpdatePaymentDto
> {
  constructor(protected prismaService: PrismaService) {
    super(prismaService, {
      modelName: 'Payment',

      defaultInclude: {
        booking: true,
      },
    });
  }
}
