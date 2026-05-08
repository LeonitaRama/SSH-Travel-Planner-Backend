import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class HotelsService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.hotel.create({
      data,
    });
  }

  findAll() {
    return this.prisma.hotel.findMany();
  }
}