import { PrismaClient, NOTIFICATION_TYPE } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const createPrismaClient = () =>
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
  });

const prisma = global.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

if (process.env.NODE_ENV === 'production') {
  process.on('beforeExit', async () => {
    console.log('🔄 Disconnecting from database...');
    await prisma.$disconnect();
    console.log('✅ Database disconnected');
  });
}

export default prisma;
export { NOTIFICATION_TYPE };
