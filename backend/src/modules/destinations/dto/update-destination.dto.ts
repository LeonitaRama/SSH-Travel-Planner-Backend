import { PartialType } from '@nestjs/swagger';
import { CreateDestinationDto } from './create-destination.dto.js';

export class UpdateDestinationDto extends PartialType(CreateDestinationDto) {}