import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { BaseCrudService } from '../../common/services/base-crud.service.js';
import { CreateDestinationDto } from './dto/create-destination.dto.js';
import { UpdateDestinationDto } from './dto/update-destination.dto.js';

@Injectable()
export class DestinationsService extends BaseCrudService<
  any, // Këtu mund të vendosni tipin e Prismaskit Destination nëse doni tipizim të fortë
  CreateDestinationDto,
  UpdateDestinationDto
> {
  constructor(protected prismaService: PrismaService) {
    super(prismaService, {
      modelName: 'Destination', // Duhet të përputhet ekzaktësisht me emrin e modelit te schema.prisma
      // defaultSelect: { id: true, name: true, country: true } // Opcionale, nëse doni select specifik
    });
  }

  // Nëse në të ardhmen ju duhet ndonjë query specifike që s'e ka BaseService, e shkruani këtu.
}

// Lidhjet komplekse (Relations/Includes):
// Kur të krijosh TripsService, ti do të dëshironi që kur thirret findOne, klienti të shohë edhe detajet e Destination që i takon ai trip. Për këtë shërben objekti options që ke krijuar te BaseCrudService! Në konstruktorin e TripsService thjesht do të bësh:
// constructor(protected prismaService: PrismaService) {
//      super(prismaService, {
//        modelName: 'trip',
//        defaultInclude: { destination: true } // Kjo do të bëjë automatikisht join me tabelën Destination në çdo query!
//      });
//    }
