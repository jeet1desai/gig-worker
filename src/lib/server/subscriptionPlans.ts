import prisma from '@/lib/prisma';
import { SubscriptionPlanPayload } from '@/types/fe';
import { Decimal } from '@prisma/client/runtime/library';
import { safeJson } from '@/lib/utils/safeJson';
import lodash from 'lodash';
import { getPlanDetailsById } from '../paypal/plans';
import { SUBSCRIPTION_TYPE } from '@prisma/client';

export const getPlans = async () => {
  const plans = await prisma.plan.findMany({
    where: { isPublic: true, status: 'ACTIVE' },
    orderBy: { price: 'asc' },
  });

  return safeJson(plans);
};

export const createPlan = async (plan_details: SubscriptionPlanPayload, paypal_plan_id: string) => {
  const paypal_plain_details = await getPlanDetailsById(paypal_plan_id);

  const billing_cycles = paypal_plain_details.billing_cycles[0];
  const priceInfo = billing_cycles.pricing_scheme?.fixed_price;
  const setupFee = paypal_plain_details.payment_preferences.setup_fee;
  const tax = paypal_plain_details.taxes.percentage;

  await prisma.plan.create({
    data: {
      plan_id: paypal_plain_details.id,
      product_id: paypal_plain_details.product_id,
      name: paypal_plain_details.name,
      description: paypal_plain_details.description || '',
      status: paypal_plain_details.status,
      price: new Decimal(plan_details.price),
      type: plan_details.subscriptionType as SUBSCRIPTION_TYPE,
      currency: priceInfo.currency_code,
      interval: billing_cycles.frequency.interval_unit || 'MONTH',
      interval_count: billing_cycles.frequency.interval_count || 1,
      billing_cycle_count: billing_cycles.total_cycles || 0,
      usage_type: paypal_plain_details.usage_type,
      setup_fee: setupFee ? new Decimal(setupFee.value) : undefined,
      tax_percentage: tax ? new Decimal(tax) : undefined,
      merchant_id: paypal_plain_details?.payee?.merchant_id || 'unknown',
      benefits: plan_details.benefits,
      isPublic: true,
      maxGigs: plan_details.maxGigs,
      maxBids: plan_details.maxBids,
    },
  });

  return 'Subscription plan created successfully';
};

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

export const deletePlan = async (plan_id: string) => {
  await prisma.plan.update({
    where: { plan_id: plan_id },
    data: {
      status: 'INACTIVE',
    },
  });

  return 'Subscription plan deleted successfully';
};
