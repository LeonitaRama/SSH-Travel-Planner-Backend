// prisma/seed.ts
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 ========================================');
  console.log('🌱 Starting database seeding...');
  console.log('🌱 ========================================\n');

  // Step 1: Krijo tenant default
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

  // Step 2: Krijo admin user
  console.log('📌 Step 2: Creating admin user...');

  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@travel.com' },
    update: {},
    create: {
      email: 'admin@travel.com',
      username: 'admin',
      password: hashedPassword,
      tenantId: tenant.id,
      role: Role.SUPER_ADMIN, // Përdor enum-in e Prisma-s, jo string
    },
  });

  console.log(`✅ Admin user created:`);
  console.log(`   ID: ${admin.id}`);
  console.log(`   Email: ${admin.email}`);
  console.log(`   Username: ${admin.username}`);
  console.log(`   Role: ${admin.role}\n`);

  // Step 3: Krijo disa usera testues
  console.log('📌 Step 3: Creating test users...');

  const testUsers = [
    {
      email: 'user1@travel.com',
      username: 'user1',
      role: Role.USER,
    },
    {
      email: 'user2@travel.com',
      username: 'user2',
      role: Role.USER,
    },
    {
      email: 'admin2@travel.com',
      username: 'admin2',
      role: Role.ADMIN,
    },
  ];

  for (const userData of testUsers) {
    const hashedUserPassword = await bcrypt.hash('password123', 10);

    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        username: userData.username,
        password: hashedUserPassword,
        tenantId: tenant.id,
        role: userData.role, // Tani përdor enum
      },
    });

    console.log(`   ✅ Created user: ${userData.email} (${userData.role})`);
  }

  // Step 4: Shto një user me rolin TENANT_ADMIN (nëse e ke në skemë)
  if (Object.values(Role).includes('TENANT_ADMIN' as any)) {
    console.log('\n📌 Step 4: Creating tenant admin user...');

    const hashedTenantAdminPassword = await bcrypt.hash('tenantadmin123', 10);

    await prisma.user.upsert({
      where: { email: 'tenantadmin@travel.com' },
      update: {},
      create: {
        email: 'tenantadmin@travel.com',
        username: 'tenantadmin',
        password: hashedTenantAdminPassword,
        tenantId: tenant.id,
        role: Role.ADMIN, // Përdor ADMIN nëse TENANT_ADMIN nuk ekziston
      },
    });

    console.log(`   ✅ Created user: tenantadmin@travel.com (TENANT_ADMIN)`);
  }

  console.log('\n🌱 ========================================');
  console.log('🌱 Seeding completed successfully!');
  console.log('🌱 ========================================');
  console.log('\n📝 Test credentials:');
  console.log('   Admin: admin@travel.com / admin123');
  console.log('   User1: user1@travel.com / password123');
  console.log('   User2: user2@travel.com / password123');
  console.log('   Admin2: admin2@travel.com / password123');
}

main()
  .catch((e) => {
    console.error('\n❌ Seeding failed!');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
