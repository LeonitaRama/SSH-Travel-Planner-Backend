import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class DestinationsService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.destination.create({
      data,
    });
  }

  findAll() {
    return this.prisma.destination.findMany();
  }
}