export class CreateBookingDto {
  userId!: string;
  flightId!: string;
  hotelId?: string;
  date!: string;
  status?: string;
}