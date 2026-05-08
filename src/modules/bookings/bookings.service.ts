import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateBookingDto) {
    return this.prisma.booking.create({
      data,
    });
  }

  findAll() {
    return this.prisma.booking.findMany({
      include: {
        user: true,
        flight: true,
        hotel: true,
      },
    });
  }
}