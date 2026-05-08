import { Controller, Get, Post, Body } from '@nestjs/common';
import { HotelsService } from './hotels.service.js';
import { CreateHotelDto } from './dto/create-hotel.dto.js';

@Controller('hotels')
export class HotelsController {
  constructor(private readonly service: HotelsService) {}

  @Post()
  create(@Body() body: CreateHotelDto) {
    return this.service.create(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}