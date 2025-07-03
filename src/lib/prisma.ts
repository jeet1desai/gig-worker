import { PrismaClient, NOTIFICATION_TYPE } from '@prisma/client';

let prisma: PrismaClient;

async function testConnection(client: PrismaClient) {
  try {
    await client.$connect();
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

  testConnection(prisma).then((connected) => {
    if (!connected) {
      console.error('Failed to connect to database in production');
    }
  });
} else {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });

    testConnection((global as any).prisma).then((connected) => {
      if (connected) {
        console.log('🚀 Development database ready');
      }
    });
  }
  prisma = (global as any).prisma;
}

process.on('beforeExit', async () => {
  console.log('🔄 Disconnecting from database...');
  await prisma.$disconnect();
  console.log('✅ Database disconnected');
});

export default prisma;

export { NOTIFICATION_TYPE };
