import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AgenciesModule } from './modules/agencies/agencies.module';
import { FlightsModule } from './modules/flights/flights.module';
import { HotelsModule } from './modules/hotels/hotels.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { SearchModule } from './modules/search/search.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AiModule } from './modules/ai/ai.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, UsersModule, AgenciesModule, FlightsModule, HotelsModule, BookingsModule, PaymentsModule, SearchModule, NotificationsModule, AiModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
