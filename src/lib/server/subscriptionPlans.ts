import lodash from 'lodash';
import { SUBSCRIPTION_STATUS, SUBSCRIPTION_TYPE } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { getServerSession } from 'next-auth';
import { SubscriptionPlanPayload } from '@/types/fe';
import { safeJson } from '@/lib/utils/safeJson';
import { getPlanDetailsById } from '@/lib/paypal/plans';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { FREE_PLAN, FREE_PLAN_ID } from '@/constants/plans';

export async function getCurrentUserActiveSubscription() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  const userId = BigInt(session.user.id);

  const subscription = await prisma.subscription.findFirst({
    where: {
      user_id: userId,
      status: SUBSCRIPTION_STATUS.active
    },
    include: {
      plan: true
    }
  });

  return safeJson(subscription);
}

export const getPlans = async () => {
  const plans = await prisma.plan.findMany({
    where: { isPublic: true, status: SUBSCRIPTION_STATUS.active },
    orderBy: { price: 'asc' }
  });

  return safeJson(plans);
};

export const getPlanByPlanId = async (id: string) => {
  const plan = await prisma.plan.findUnique({
    where: { plan_id: id, isPublic: true, status: SUBSCRIPTION_STATUS.active }
  });

  return safeJson(plan);
};

export const createPlan = async (plan_details: SubscriptionPlanPayload, plan_id: string) => {
  if (plan_id === FREE_PLAN_ID) {
    const existingFreePlan = await prisma.plan.findUnique({
      where: {
        plan_id: FREE_PLAN_ID
      }
    });

    if (existingFreePlan) {
      await prisma.plan.update({
        where: {
          plan_id: FREE_PLAN_ID
        },
        data: {
          plan_id: FREE_PLAN_ID,
          product_id: FREE_PLAN.product_id,
          name: plan_details.name,
          description: plan_details.description,
          status: SUBSCRIPTION_STATUS.active,
          price: new Decimal(FREE_PLAN.price),
          type: plan_details.subscriptionType as SUBSCRIPTION_TYPE,
          benefits: plan_details.benefits,
          maxGigs: plan_details.maxGigs,
          maxBids: plan_details.maxBids
        }
      });
    } else {
      await prisma.plan.create({
        data: {
          plan_id: FREE_PLAN_ID,
          product_id: FREE_PLAN.product_id,
          name: plan_details.name,
          description: plan_details.description,
          status: SUBSCRIPTION_STATUS.active,
          price: new Decimal(FREE_PLAN.price),
          type: plan_details.subscriptionType as SUBSCRIPTION_TYPE,
          currency: FREE_PLAN.currency,
          interval: FREE_PLAN.interval,
          interval_count: FREE_PLAN.interval_count,
          billing_cycle_count: FREE_PLAN.billing_cycle_count,
          usage_type: FREE_PLAN.usage_type,
          setup_fee: new Decimal(FREE_PLAN.setup_fee),
          tax_percentage: new Decimal(FREE_PLAN.tax_percentage),
          merchant_id: FREE_PLAN.merchant_id,
          isPublic: FREE_PLAN.isPublic,
          benefits: plan_details.benefits,
          maxGigs: plan_details.maxGigs,
          maxBids: plan_details.maxBids
        }
      });
    }

    return 'Subscription plan created successfully';
  }

  const paypalDetails = await getPlanDetailsById(plan_id);
  const billing = paypalDetails.billing_cycles[0];
  const priceInfo = billing.pricing_scheme?.fixed_price;
  const setupFee = paypalDetails.payment_preferences?.setup_fee?.value;
  const tax = paypalDetails.taxes?.percentage;

  await prisma.plan.create({
    data: {
      plan_id: paypalDetails.id,
      product_id: paypalDetails.product_id,
      name: paypalDetails.name,
      description: paypalDetails.description || '',
      status: SUBSCRIPTION_STATUS.active,
      price: new Decimal(plan_details.price),
      type: plan_details.subscriptionType as SUBSCRIPTION_TYPE,
      currency: priceInfo.currency_code,
      interval: billing.frequency.interval_unit,
      interval_count: billing.frequency.interval_count,
      billing_cycle_count: billing.total_cycles || 0,
      usage_type: paypalDetails.usage_type,
      setup_fee: setupFee ? new Decimal(setupFee) : undefined,
      tax_percentage: tax ? new Decimal(tax) : undefined,
      merchant_id: paypalDetails?.payee?.merchant_id || 'unknown',
      benefits: plan_details.benefits,
      isPublic: true,
      maxGigs: plan_details.maxGigs,
      maxBids: plan_details.maxBids
    }
  });

  return 'Subscription plan created successfully';
};

export const updatePlan = async (plan_id: string, plan_details: SubscriptionPlanPayload) => {
  const existingPlan = await prisma.plan.findUnique({
    where: { plan_id: plan_id }
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
      where: { plan_id: plan_id },
      data
    });
  }

  return 'Subscription plan updated successfully';
};

export const deletePlan = async (plan_id: string) => {
  await prisma.plan.update({
    where: { plan_id: plan_id },
    data: {
      status: SUBSCRIPTION_STATUS.inactive
    }
  });

  return 'Subscription plan deleted successfully';
};
