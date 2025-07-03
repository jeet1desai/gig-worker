import { safeJson } from '@/lib/utils/safeJson';
import prisma from '@/lib/prisma';

export const getPlans = async () => {
  const plans = await prisma.plan.findMany({
    where: { isPublic: true, status: 'ACTIVE' },
    orderBy: { price: 'asc' },
  });

  return safeJson(plans);
};
