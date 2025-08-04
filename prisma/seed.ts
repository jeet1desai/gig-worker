import prisma from '@/lib/prisma';
import { generateUniqueUsernameFromEmail } from '@/lib/server/auth';
import bcrypt from 'bcryptjs';

async function main() {
  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  const existingAdmin = await prisma.admin.findUnique({
    where: {
      email: 'admin@gigworker.com'
    }
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
        profile_url: ''
      }
    });
  }

  await backfillUserUsernames();
}

async function backfillUserUsernames() {
  const users = await prisma.user.findMany({
    where: { username: null },
    select: { id: true, email: true }
  });

  if (users.length === 0) {
    console.log('All users already have usernames');
    return;
  }

  for (const user of users) {
    try {
      const username = await generateUniqueUsernameFromEmail(user.email);
      await prisma.user.update({
        where: { id: user.id },
        data: { username }
      });
      console.log(`Username "${username}" assigned to ${user.email}`);
    } catch (error) {
      console.error(`Failed to assign username to ${user.email}`, error);
    }
  }

  console.log('Username backfill complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
