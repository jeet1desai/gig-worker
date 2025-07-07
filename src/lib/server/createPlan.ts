import prisma from '@/lib/prisma';
import { SubscriptionPlanPayload } from '@/types/fe';
import { Decimal } from '@prisma/client/runtime/library';
import { getPlanDetailsById } from '../paypal';

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
