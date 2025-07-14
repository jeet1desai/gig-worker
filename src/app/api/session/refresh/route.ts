import { authOptions } from '../../auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      subscriptions: {
        where: { status: 'active' },
        orderBy: { created_at: 'desc' },
        take: 1,
        select: { type: true }
      }
    }
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const subscription = user.subscriptions?.[0]?.type || null;

  return NextResponse.json({
    data: {
      message: 'Fetched subscription',
      subscription
    }
  });
}
