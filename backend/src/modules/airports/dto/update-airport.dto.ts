import { PartialType } from '@nestjs/swagger';
import { CreateAirportDto } from './create-airport.dto.js';

export class UpdateAirportDto extends PartialType(CreateAirportDto) {}
