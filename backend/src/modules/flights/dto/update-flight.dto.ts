import { PartialType } from '@nestjs/swagger';
import { CreateFlightDto } from './create-flight.dto.js';

export class UpdateFlightDto extends PartialType(CreateFlightDto) {}
