// prisma/seed.ts (versioni i plotë i korrigjuar)
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
  // KRIJO SUPER ADMIN USER-IN E PARË
  // ============================================
  console.log('📌 Step 2: Creating super admin user...');

  const adminPassword = await bcrypt.hash('admin123', 10);

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
      password: adminPassword,
      tenantId: tenant.id,
      role: 'SUPER_ADMIN',
    },
  });

  console.log(`✅ Super Admin user created:`);
  console.log(`   ID: ${admin.id}`);
  console.log(`   Email: ${admin.email}`);
  console.log(`   Username: ${admin.username}`);
  console.log(`   Role: ${admin.role}\n`);

  // ============================================
  // KRIJO ADMIN PËR TENANT-IN
  // ============================================
  console.log('📌 Step 3: Creating tenant admin user...');

  const tenantAdmin = await prisma.user.upsert({
    where: {
      email_tenantId: {
        email: 'tenant-admin@travel.com',
        tenantId: tenant.id,
      },
    },
    update: {},
    create: {
      email: 'tenant-admin@travel.com',
      username: 'tenantadmin',
      password: adminPassword,
      tenantId: tenant.id,
      role: 'ADMIN',
    },
  });

  console.log(`✅ Tenant Admin user created:`);
  console.log(`   Email: ${tenantAdmin.email}`);
  console.log(`   Username: ${tenantAdmin.username}`);
  console.log(`   Role: ${tenantAdmin.role}\n`);

  // ============================================
  // KRIJO CUSTOMER TEST PËR TENANT-IN
  // ============================================
  console.log('📌 Step 4: Creating test customer...');

  const customerPassword = await bcrypt.hash('test123', 10);

  const testUser = await prisma.user.upsert({
    where: {
      email_tenantId: {
        email: 'customer@travel.com',
        tenantId: tenant.id,
      },
    },
    update: {},
    create: {
      email: 'customer@travel.com',
      username: 'customer',
      password: customerPassword,
      tenantId: tenant.id,
      role: 'CUSTOMER', // ← E RREGULLUAR!!!
    },
  });

  console.log(`✅ Test customer created:`);
  console.log(`   Email: ${testUser.email}`);
  console.log(`   Username: ${testUser.username}`);
  console.log(`   Role: ${testUser.role}\n`);

  // ============================================
  // KRIJO STAFF USER PËR TENANT-IN
  // ============================================
  console.log('📌 Step 5: Creating staff user...');

  const staffUser = await prisma.user.upsert({
    where: {
      email_tenantId: {
        email: 'staff@travel.com',
        tenantId: tenant.id,
      },
    },
    update: {},
    create: {
      email: 'staff@travel.com',
      username: 'staffmember',
      password: customerPassword,
      tenantId: tenant.id,
      role: 'STAFF',
    },
  });

  console.log(`✅ Staff user created:`);
  console.log(`   Email: ${staffUser.email}`);
  console.log(`   Username: ${staffUser.username}`);
  console.log(`   Role: ${staffUser.role}\n`);

  // ============================================
  // STATISTIKAT E FUNDIT
  // ============================================
  console.log('📊 ========================================');
  console.log('📊 Seeding completed successfully!');
  console.log('📊 ========================================');

  const userCount = await prisma.user.count();
  console.log(`\n📝 Summary:`);
  console.log(`   • 1 Tenant created`);
  console.log(
    `   • ${userCount} users created (1 super admin, 1 tenant admin, 1 staff, 1 customer)`,
  );
  console.log(`\n🔐 Login credentials:`);
  console.log(
    `   Super Admin: admin@travel.com / admin123 (role: SUPER_ADMIN)`,
  );
  console.log(
    `   Tenant Admin: tenant-admin@travel.com / admin123 (role: ADMIN)`,
  );
  console.log(`   Staff: staff@travel.com / test123 (role: STAFF)`);
  console.log(`   Customer: customer@travel.com / test123 (role: CUSTOMER)`);
  console.log(`\n📌 Tenant ID: ${tenant.id}`);
  console.log(`\n🚀 You can now test the API:`);
  console.log(`   Swagger: http://localhost:3000/api`);
  console.log(`   Login with different roles to test authorization!\n`);
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

// src/modules/setup/setup.controller.ts
// import { Controller, Post, Body } from '@nestjs/common';
// import { PrismaService } from '../src/modules/prisma/prisma.service.js';
// import * as bcrypt from 'bcrypt';
// import { Public } from '../src/common/decorators/public.decorator.js';

// @Controller('setup')
// export class SetupController {
//   constructor(private prisma: PrismaService) {}

//   @Public()
//   @Post('init')
//   async initializeSystem() {
//     // Krijo SUPER_ADMIN tenant
//     const superTenant = await this.prisma.tenant.create({
//       data: {
//         name: 'System Admin',
//         slug: 'system',
//       },
//     });

//     // Krijo SUPER_ADMIN user
//     const hashedPassword = await bcrypt.hash('Admin123!', 10);
//     const superAdmin = await this.prisma.user.create({
//       data: {
//         email: 'superadmin@system.com',
//         password: hashedPassword,
//         username: 'superadmin',
//         role: 'SUPER_ADMIN',
//         tenantId: superTenant.id,
//       },
//     });

//     return {
//       message: 'System initialized',
//       tenant: { id: superTenant.id, name: superTenant.name },
//       user: { email: superAdmin.email, role: superAdmin.role },
//     };
//   }
// }
///kthejeeee
// // src/modules/seed/seed.controller.ts
// import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
// import { PrismaService } from '../src/modules/prisma/prisma.service.js';
// import * as bcrypt from 'bcrypt';
// import { Public } from '../src/common/decorators/public.decorator.js';
// import { ApiTags, ApiOperation } from '@nestjs/swagger';

// @ApiTags('Seed')
// @Controller('seed')
// export class SeedController {
//   constructor(private prisma: PrismaService) {}

//   @Public()
//   @Post()
//   @ApiOperation({
//     summary: 'Initialize system with first tenant and SUPER_ADMIN (dev only)',
//   })
//   @HttpCode(HttpStatus.CREATED)
//   async seed() {
//     // Kontrollo nëse ekziston ndonjë tenant
//     const tenantCount = await this.prisma.tenant.count();
//     if (tenantCount > 0) {
//       return { message: 'System already initialized' };
//     }

//     // Krijo tenant-in e parë
//     const tenant = await this.prisma.tenant.create({
//       data: {
//         name: 'System Tenant',
//         slug: 'system',
//       },
//     });

//     // Krijo SUPER_ADMIN user
//     const hashedPassword = await bcrypt.hash('Admin123!', 10);
//     const admin = await this.prisma.user.create({
//       data: {
//         email: 'superadmin@system.com',
//         username: 'superadmin',
//         password: hashedPassword,
//         role: 'SUPER_ADMIN',
//         tenantId: tenant.id,
//       },
//     });

//     return {
//       message: 'System initialized successfully',
//       tenant: { id: tenant.id, name: tenant.name },
//       admin: { id: admin.id, email: admin.email, role: admin.role },
//     };
//   }
// }
