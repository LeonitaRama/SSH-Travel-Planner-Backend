import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

import { BaseCrudService } from '../../common/services/base-crud.service.js';

import { CreateRoomDto } from './dto/create-room.dto.js';
import { UpdateRoomDto } from './dto/update-room.dto.js';
import { Room } from '@prisma/client';

@Injectable()
export class RoomsService extends BaseCrudService<
  Room,
  CreateRoomDto,
  UpdateRoomDto
> {
  constructor(protected prismaService: PrismaService) {
    super(prismaService, {
      modelName: 'room',

      defaultInclude: {
        hotel: true,
      },
    });
  }
}
