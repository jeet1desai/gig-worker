import PricingClientWrapper from '@/app/plans/components/PricingClientWrapper';
import { getCurrentUserActiveSubscription, getPlans } from '@/lib/server/subscriptionPlans';

export default async function PricingPage() {
  const subscription = await getCurrentUserActiveSubscription();
  const plans = await getPlans();

  return (
    <div className="min-h-screen bg-[#1E1E1E] px-6 py-16 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h1 className="font-['Outfit'] text-[2.7rem] font-medium text-[#FFF2E3]">
            Find Your Perfect Plan
          </h1>
          <p className="mt-2 font-['Outfit'] font-light text-[#B9BEC1]">
            Discover the ideal plan to fuel your service's growth. Our
            <br /> pricing options are designed to support you.
          </p>
        </div>

        <PricingClientWrapper plans={plans} activeSubscription={subscription} />
      </div>
    </div>
  );
}
