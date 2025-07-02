import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  const existingAdmin = await prisma.admin.findUnique({
    where: {
      email: 'admin@gigworker.com',
    },
  });

  if (!existingAdmin) {
    await prisma.admin.upsert({
      where: { email: 'admin@gigworker.com' },
      update: {},
      create: {
        email: 'admin@gigworker.com',
        first_name: 'Super',
        last_name: 'Admin',
        password: hashedPassword,
        profile_url: '',
        role: 'admin',
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
