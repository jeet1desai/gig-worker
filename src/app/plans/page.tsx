import PlanCard from '@/components/PlanCard';
import { getPlans } from '@/lib/server/getPlans';

export default async function PricingPage() {
  const plans = await getPlans();

  return (
    <div className="min-h-screen bg-[#1E1E1E] px-6 py-16 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h1 className="font-['Outfit'] text-[2.7rem] font-medium text-[#FFF2E3]">Find Your Perfect Plan</h1>
          <p className="mt-2 font-['Outfit'] font-light text-[#B9BEC1]">
            Discover the ideal plan to fuel your service's growth. Our
            <br /> pricing options are designed to support you.
          </p>
        </div>

        <div className="flex w-full flex-wrap justify-center gap-8">
          {plans.map((plan: any) => (
            <PlanCard key={plan.plan_id} plan={plan} />
          ))}
        </div>
      </div>
    </div>
  );
}
