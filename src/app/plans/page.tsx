import Header from '@/components/Header';
import PricingClientWrapper from '@/app/plans/components/PricingClientWrapper';
import { getCurrentUserActiveSubscription, getPlans } from '@/lib/server/subscriptionPlans';
import GoBackButton from '@/components/GoBackButton';

export default async function PricingPage() {
  const subscription = await getCurrentUserActiveSubscription();
  const plans = await getPlans();

  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b border-b-gray-700">
        <Header />
      </div>
      <div className="relative flex-1 bg-[#1E1E1E] px-5 py-3 md:px-8">
        <GoBackButton />
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h1 className="text-[2.7rem] font-medium text-[#FFF2E3]">Find Your Perfect Plan</h1>
            <p className="mt-2 font-light text-[#B9BEC1]">
              Discover the ideal plan to fuel your service's growth. Our
              <br /> pricing options are designed to support you.
            </p>
          </div>

          <PricingClientWrapper plans={plans} activeSubscription={subscription} />
        </div>
      </div>
    </div>
  );
}
