import prisma from '@/lib/prisma';

export const deletePlan = async (plan_id: string) => {
  await prisma.plan.update({
    where: { plan_id: plan_id },
    data: {
      status: 'INACTIVE',
    },
  });

  return 'Subscription plan deleted successfully';
};
