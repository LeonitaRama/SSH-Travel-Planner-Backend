// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';
import * as bcrypt from 'bcrypt';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Krijo tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'tenant1' },
    update: {},
    create: {
      name: 'Test Tenant',
      slug: 'tenant1',
    },
  });

  console.log('✅ Tenant created:', tenant.id);

  // Hash password
  const hashedPassword = await bcrypt.hash('123456', 10);

  // Krijo user
  await prisma.user.upsert({
    where: {
      email_tenantId: {
        email: 'admin@test.com',
        tenantId: tenant.id,
      },
    },
    update: {},
    create: {
      email: 'admin@test.com',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      tenantId: tenant.id,
    },
  });

  console.log('🌱 Seed completed successfully');
  console.log('📝 Tenant ID (save for testing):', tenant.id);
  console.log('👤 Admin email: admin@test.com');
  console.log('🔑 Admin password: 123456');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
