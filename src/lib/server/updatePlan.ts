import { Decimal } from '@prisma/client/runtime/library';
import lodash from 'lodash';
import prisma from '@/lib/prisma';
import { SubscriptionPlanPayload } from '@/types/fe';

export const updatePlan = async (paypal_plan_id: string, plan_details: SubscriptionPlanPayload) => {
  const existingPlan = await prisma.plan.findUnique({
    where: { plan_id: paypal_plan_id },
  });

  if (!existingPlan) {
    return 'Plan not found';
  }

  const data: Record<string, any> = {};

  if (!lodash.isEqual(plan_details.name, existingPlan.name)) {
    data.name = plan_details.name;
  }

  if (!lodash.isEqual(plan_details.description || '', existingPlan.description)) {
    data.description = plan_details.description || '';
  }

  if (!lodash.isEqual(new Decimal(plan_details.price), existingPlan.price)) {
    data.price = new Decimal(plan_details.price);
  }

  if (!lodash.isEqual(plan_details.benefits, existingPlan.benefits)) {
    data.benefits = plan_details.benefits;
  }

  if (!lodash.isEqual(plan_details.maxGigs, existingPlan.maxGigs)) {
    data.maxGigs = plan_details.maxGigs;
  }

  if (!lodash.isEqual(plan_details.maxBids, existingPlan.maxBids)) {
    data.maxBids = plan_details.maxBids;
  }

  if (Object.keys(data).length > 0) {
    await prisma.plan.update({
      where: { plan_id: paypal_plan_id },
      data,
    });
  }

  return 'Subscription plan updated successfully';
};
