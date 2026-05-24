import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { PrismaService } from '../src/modules/prisma/prisma.service.js';

jest.mock('@nestjs/bullmq', () => ({
  InjectQueue: jest.fn(),
  Process: jest.fn(),
  Processor: jest.fn(),
  BullModule: { registerQueue: jest.fn() },
}));

describe('Auth System (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  const tenantId = 'd1104503-5a1a-410c-ab00-4dac707ddba0';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('POST /auth/login - should login and return token', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .set('x-tenant-id', tenantId)
      .send({ email: 'admin@travel.com', password: 'admin123' })
      .expect(200);
    authToken = response.body.access_token;
    expect(authToken).toBeDefined();
  });

  it('GET /auth/profile - should return profile with valid token', () => {
    return request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
  });

  it('GET /auth/profile - should return 401 without token', () => {
    return request(app.getHttpServer()).get('/auth/profile').expect(401);
  });

  // ✅ KËTU VENDOS afterAll (pas të gjitha testeve)
  afterAll(async () => {
    const prisma = app.get(PrismaService);
    await prisma.$disconnect();
    await app.close();
    // Vonesë e vogël për të lejuar mbylljen e operacioneve asinkrone
    await new Promise((resolve) => setTimeout(resolve, 100));
  });
});
