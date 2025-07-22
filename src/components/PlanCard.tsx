'use client';

import { FC } from 'react';

import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { ISafePlan } from '@/types/fe/api-responses';

const iconMap: Record<string, string> = {
  Free: '/icons/star.svg',
  Basic: '/icons/dart-arrow.svg',
  Pro: '/icons/gem.svg'
};

const intervalMap: Record<string, string> = {
  MONTH: 'per month',
  YEAR: 'per year'
};

interface Props {
  plan: ISafePlan;
  activePlanId?: number;
  onChoosePlan: () => void;
}

const PlanCard: FC<Props> = ({ plan, activePlanId, onChoosePlan }) => {
  const { name, price, currency, description, benefits, interval } = plan;
  const iconSrc = iconMap[name];
  const isActivePlan = activePlanId === plan.id;

  return (
    <div className="flex h-full min-h-[583px] w-full max-w-[380px] flex-col items-start justify-start gap-11 overflow-hidden rounded-[26px] bg-[#0D0C0C] p-8 shadow-[0px_26px_40px_0px_rgba(188,202,255,0.13)]">
      <div className="mb-10 flex flex-1 flex-col items-start justify-start gap-3 self-stretch">
        <div className="mb-2 flex flex-col items-start justify-start gap-3 self-stretch">
          <div className="mb-2 flex h-[40px] w-[40px] items-center justify-center overflow-hidden rounded-[14px] bg-[#1E1E1E]">
            {iconSrc && <img src={iconSrc} alt={`${name} icon`} className="h-5 w-5" />}
          </div>
          <div className="flex flex-col items-start justify-start gap-3 self-stretch">
            <div className="flex flex-col items-start justify-start gap-2 self-stretch">
              <div className="justify-start self-stretch font-['Outfit'] text-4xl font-medium text-[#FFF2E3]">{name}</div>
              <div className="w-[90%] justify-start self-stretch font-['Outfit'] text-[1rem] leading-normal font-light text-[#D2D7D9]">
                {description}
              </div>
            </div>
            <div className="flex items-baseline gap-3">
              <div className="justify-start font-['Outfit'] text-[2.5rem] font-medium text-[#FFF2E3]">{formatCurrency(price, currency)}</div>
              <div className="justify-start font-['Outfit'] text-xl font-light text-[#868C92]">{Number(price) > 0 && intervalMap[interval]}</div>
            </div>
          </div>
        </div>
        <div className="h-[1px] w-full bg-[#E7EBFF]"></div>
        <div className="mt-3.5 flex flex-col items-start justify-start gap-6 self-stretch">
          {benefits.map((benefit: string) => {
            return (
              <div key={benefit} className="flex items-center justify-start gap-4 self-stretch">
                <div className="h-4 w-4 overflow-hidden rounded-md">
                  <img src="/icons/custom-check.svg" alt="check" className="h-full w-full" />
                </div>
                <div className="flex-1 font-['Outfit'] text-lg leading-4 font-normal text-gray-300">{benefit}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex w-full items-center justify-center">
        <Button
          variant={isActivePlan ? 'default' : 'secondary'}
          disabled={isActivePlan}
          className="text-md h-12 w-full cursor-pointer rounded-xl font-['Outfit'] leading-10 font-normal disabled:cursor-default"
          onClick={onChoosePlan}
        >
          {isActivePlan ? 'Your current plan' : 'Choose plan'}
        </Button>
      </div>
    </div>
  );
};

export default PlanCard;
