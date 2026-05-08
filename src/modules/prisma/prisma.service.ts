import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private _hotel: any;
  public get hotel(): any {
    return this._hotel;
  }
  public set hotel(value: any) {
    this._hotel = value;
  }
  constructor() {
    // 1. Krijojmë pool-in e lidhjes
    const pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
    });

    // 2. Krijojmë adapterin për Prisma 7
    const adapter = new PrismaPg(pool);

    // 3. Kalojmë adapterin te PrismaClient
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
