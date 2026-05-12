// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';
import * as bcrypt from 'bcrypt';

// Konfiguro lidhjen me databazë
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 ========================================');
  console.log('🌱 Starting database seeding...');
  console.log('🌱 ========================================\n');

  // ============================================
  // KRIJO TENANT-IN E PARË (DEFAULT)
  // ============================================
  console.log('📌 Step 1: Creating default tenant...');

  const tenant = await prisma.tenant.upsert({
    where: { slug: 'tenant1' },
    update: {},
    create: {
      name: 'Default Travel Agency',
      slug: 'tenant1',
    },
  });

  console.log(`✅ Tenant created:`);
  console.log(`   ID: ${tenant.id}`);
  console.log(`   Name: ${tenant.name}`);
  console.log(`   Slug: ${tenant.slug}\n`);

  // ============================================
  // KRIJO ADMIN USER-IN E PARË
  // ============================================
  console.log('📌 Step 2: Creating admin user...');

  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: {
      email_tenantId: {
        email: 'admin@travel.com',
        tenantId: tenant.id,
      },
    },
    update: {},
    create: {
      email: 'admin@travel.com',
      username: 'admin',
      password: hashedPassword,
      tenantId: tenant.id,
      role: 'SUPER_ADMIN',
    },
  });

  console.log(`✅ Admin user created:`);
  console.log(`   ID: ${admin.id}`);
  console.log(`   Email: ${admin.email}`);
  console.log(`   Username: ${admin.username}`);
  console.log(`   Role: ${admin.role}\n`);

  // ============================================
  // KRIJO DISA USER TEST PËR TENANT-IN
  // ============================================
  console.log('📌 Step 3: Creating test users...');

  const testPassword = await bcrypt.hash('test123', 10);

  const testUser = await prisma.user.upsert({
    where: {
      email_tenantId: {
        email: 'user@travel.com',
        tenantId: tenant.id,
      },
    },
    update: {},
    create: {
      email: 'user@travel.com',
      username: 'testuser',
      password: testPassword,
      tenantId: tenant.id,
      role: 'USER',
    },
  });

  console.log(`✅ Test user created:`);
  console.log(`   Email: ${testUser.email}`);
  console.log(`   Username: ${testUser.username}`);
  console.log(`   Role: ${testUser.role}\n`);

  // ============================================
  // STATISTIKAT E FUNDIT
  // ============================================
  console.log('📊 ========================================');
  console.log('📊 Seeding completed successfully!');
  console.log('📊 ========================================');
  console.log(`\n📝 Summary:`);
  console.log(`   • 1 Tenant created`);
  console.log(`   • 2 Users created (1 admin, 1 regular)`);
  console.log(`\n🔐 Login credentials:`);
  console.log(`   Admin: admin@travel.com / admin123`);
  console.log(`   User:  user@travel.com / test123`);
  console.log(`\n📌 Tenant ID: ${tenant.id}`);
  console.log(`\n🚀 You can now test the API:`);
  console.log(`   Swagger: http://localhost:3000/api`);
  console.log(`   Create tenant: POST /api/v1/tenants`);
  console.log(
    `   Register user: POST /auth/register (with x-tenant-id header)`,
  );
  console.log(`   Login: POST /auth/login (with x-tenant-id header)`);
}

// ============================================
// EKZEKUTO SEEDING
// ============================================
main()
  .catch((e) => {
    console.error('\n❌ Seeding failed!');
    console.error('Error:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
