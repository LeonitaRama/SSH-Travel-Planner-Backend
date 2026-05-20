import { PartialType } from '@nestjs/swagger';
import { CreateBookingItemDto } from './create-booking-item.dto.js';

export class UpdateBookingItemDto extends PartialType(CreateBookingItemDto) {}
