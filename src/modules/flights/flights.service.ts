import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class FlightsService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.flight.create({
      data,
    });
  }

  findAll() {
    return this.prisma.flight.findMany();
  }
}