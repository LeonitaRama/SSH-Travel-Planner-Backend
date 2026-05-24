// src/modules/prisma/prisma.service.spec.ts
import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service.js';

// Mock the external dependencies so we don't need a real DB
jest.mock('pg', () => ({
  Pool: jest.fn().mockImplementation(() => ({
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  })),
}));

jest.mock('@prisma/adapter-pg', () => ({
  PrismaPg: jest.fn().mockImplementation(() => ({})),
}));

// // Mock PrismaClient's $connect and $disconnect
// jest.mock('@prisma/client', () => ({
//   PrismaClient: jest.fn().mockImplementation(() => ({
//     $connect: jest.fn().mockResolvedValue(undefined),
//     $disconnect: jest.fn().mockResolvedValue(undefined),
//   })),
// }));

describe('PrismaService', () => {
  let service: PrismaService;
  let originalEnv: string | undefined;

  beforeAll(() => {
    originalEnv = process.env.DATABASE_URL;
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
  });

  afterAll(() => {
    if (originalEnv) process.env.DATABASE_URL = originalEnv;
    else delete process.env.DATABASE_URL;
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();
    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should connect on module init', async () => {
    const connectSpy = jest
      .spyOn(service, '$connect')
      .mockImplementation(() => Promise.resolve());
    await service.onModuleInit();
    expect(connectSpy).toHaveBeenCalled();
  });

  it('should disconnect on module destroy', async () => {
    const disconnectSpy = jest
      .spyOn(service, '$disconnect')
      .mockImplementation(() => Promise.resolve());
    await service.onModuleDestroy();
    expect(disconnectSpy).toHaveBeenCalled();
  });

  it('should throw error if DATABASE_URL is missing', () => {
    const backup = process.env.DATABASE_URL;
    delete process.env.DATABASE_URL;
    expect(() => new PrismaService()).toThrow(
      'DATABASE_URL is not defined in .env file',
    );
    process.env.DATABASE_URL = backup;
  });
});
