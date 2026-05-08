export class CreateFlightDto {
  from!: string;
  to!: string;
  price!: number;
  departureAt!: Date;
}