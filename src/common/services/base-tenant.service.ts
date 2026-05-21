import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../modules/prisma/prisma.service.js';

@Injectable()
export abstract class BaseTenantService {
  constructor(protected readonly prisma: PrismaService) {}

  protected async verifyTenantOwnership(
    tenantId: string,
    resourceId: string,
    model: string,
  ): Promise<boolean> {
    // Kthejmë emrin e modelit në shkronja të vogla për të shmangur gabimet e tipit 'User' vs 'user'
    const normalizedModel = model.toLowerCase();

    switch (normalizedModel) {
      case 'user': {
        const user = await this.prisma.user.findFirst({
          where: { id: resourceId, tenantId },
        });
        return !!user;
      }
      case 'airline': {
        const airline = await this.prisma.airline.findFirst({
          where: { id: resourceId, tenantId },
        });
        return !!airline;
      }
      case 'destination': {
        const dest = await this.prisma.destination.findFirst({
          where: { id: resourceId, tenantId },
        });
        return !!dest;
      }
      case 'hotel': {
        const hotel = await this.prisma.hotel.findFirst({
          where: { id: resourceId, tenantId },
        });
        return !!hotel;
      }
      case 'room': {
        const room = await this.prisma.room.findFirst({
          where: { id: resourceId, tenantId },
        });
        return !!room;
      }
      case 'flight': {
        const flight = await this.prisma.flight.findFirst({
          where: { id: resourceId, tenantId },
        });
        return !!flight;
      }
      case 'booking': {
        const booking = await this.prisma.booking.findFirst({
          where: { id: resourceId, tenantId },
        });
        return !!booking;
      }
      case 'airport': {
        const airport = await this.prisma.airport.findFirst({
          where: { id: resourceId, tenantId },
        });
        return !!airport;
      }
      case 'activity': {
        const activity = await this.prisma.activity.findFirst({
          where: { id: resourceId, tenantId },
        });
        return !!activity;
      }
      case 'wishlist': {
        const wishlist = await this.prisma.wishlist.findFirst({
          where: { id: resourceId, tenantId },
        });
        return !!wishlist;
      }
      case 'travelpackage': {
        // Vini re: Te Prisma bëhet camelCase automatikisht në 'travelPackage'
        const travelPackage = await this.prisma.travelPackage.findFirst({
          where: { id: resourceId, tenantId },
        });
        return !!travelPackage;
      }
      case 'aichat': {
        // Vini re: Te Prisma bëhet camelCase automatikisht në 'aiChat'
        const aiChat = await this.prisma.aiChat.findFirst({
          where: { id: resourceId, tenantId },
        });
        return !!aiChat;
      }
      default:
        return false;
    }
  }
}
