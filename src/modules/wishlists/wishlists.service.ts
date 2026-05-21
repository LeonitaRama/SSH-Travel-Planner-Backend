import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { BaseCrudService } from '../../common/services/base-crud.service.js';
import { CreateWishlistDto } from './dto/create-wishlist.dto.js';
import { UpdateWishlistDto } from './dto/update-wishlist.dto.js';
import { Wishlist } from '@prisma/client';

@Injectable()
export class WishlistsService extends BaseCrudService<
  Wishlist,
  CreateWishlistDto,
  UpdateWishlistDto
> {
  constructor(protected prismaService: PrismaService) {
    super(prismaService, {
      modelName: 'wishlist', // Duhet të përputhet me switch-case te BaseTenantService
      defaultInclude: {
        destination: true, // Sa herë që të thirret wishlist, merr edhe të dhënat e destinacionit
      },
    });
  }
}
