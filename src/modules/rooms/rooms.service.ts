import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

import { BaseCrudService } from '../../common/services/base-crud.service.js';

import { CreateRoomDto } from './dto/create-room.dto.js';
import { UpdateRoomDto } from './dto/update-room.dto.js';

@Injectable()
export class RoomsService extends BaseCrudService<
  any,
  CreateRoomDto,
  UpdateRoomDto
> {
  constructor(protected prismaService: PrismaService) {
    super(prismaService, {
      modelName: 'Room',

      defaultInclude: {
        hotel: true,
      },
    });
  }
}
