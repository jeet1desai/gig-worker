import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

import { listSubscriptionPlans } from '@/lib/paypal/plans';
import { FREE_PLAN, FREE_PLAN_ID, planBenefits } from '@/constants/plans';

const prisma = new PrismaClient();

const seedPayPalPlans = async () => {
  try {
    const plans = await listSubscriptionPlans();

    for (const plan of plans) {
      const billing = plan.billing_cycles[0];
      const priceInfo = billing.pricing_scheme?.fixed_price;

      if (!priceInfo) {
        console.warn(`Skipping plan "${plan.name}" — missing price info.`);
        continue;
      }

      const setupFee = plan.payment_preferences.setup_fee;
      const tax = plan.taxes.percentage;

      const sharedData = {
        plan_id: plan.id,
        name: plan.name,
        description: plan.description || '',
        product_id: plan.product_id,
        price: new Decimal(priceInfo.value),
        currency: priceInfo.currency_code,
        status: plan.status,
        interval: billing.frequency.interval_unit || 'MONTH',
        interval_count: billing.frequency.interval_count || 1,
        billing_cycle_count: billing.total_cycles || 0,
        usage_type: plan.usage_type || undefined,
        setup_fee: setupFee ? new Decimal(setupFee.value) : undefined,
        tax_percentage: tax ? new Decimal(tax) : undefined,
        merchant_id: plan.payee.merchant_id || 'unknown',
        benefits: planBenefits[plan.id] || [],
        isPublic: true
      };

      await prisma.plan.upsert({
        where: { plan_id: plan.id },
        update: sharedData,
        create: sharedData
      });
    }

    const existingFree = await prisma.plan.findUnique({
      where: { plan_id: 'FREE-PLAN' }
    });

    if (!existingFree) {
      await prisma.plan.create({
        data: FREE_PLAN
      });
    }

    console.log('Done seeding PayPal plans.');
  } catch (err) {
    console.error('Error while seeding PayPal plans:', err);
  } finally {
    await prisma.$disconnect();
  }
};

seedPayPalPlans();
