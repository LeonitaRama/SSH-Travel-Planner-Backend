import { Controller, Get, Post, Body } from '@nestjs/common';
import { FlightsService } from './flights.service.js';

@Controller('flights')
export class FlightsController {
  constructor(private readonly service: FlightsService) {}

  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}