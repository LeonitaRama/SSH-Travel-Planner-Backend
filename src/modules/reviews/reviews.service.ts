import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

import { BaseCrudService } from '../../common/services/base-crud.service.js';

import { CreateReviewDto } from './dto/create-review.dto.js';
import { UpdateReviewDto } from './dto/update-review.dto.js';

@Injectable()
export class ReviewsService extends BaseCrudService<
  any,
  CreateReviewDto,
  UpdateReviewDto
> {
  constructor(protected prismaService: PrismaService) {
    super(prismaService, {
      modelName: 'Review',
    });
  }
}
