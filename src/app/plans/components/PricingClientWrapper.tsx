'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { PayPalButtons, FUNDING, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import type { OnApproveData } from '@paypal/paypal-js';

import PlanCard from '@/components/PlanCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import apiService from '@/services/api';
import { PRIVATE_API_ROUTES, PRIVATE_ROUTE } from '@/constants/app-routes';
import { ApiResponse } from '@/types/shared/api-response';
import { ISafePlan, ISubscriptionCreateResponse } from '@/types/fe/api-responses';
import { PAYPAL_BUTTON_CONFIG } from '@/constants';
import { publicEnv } from '@/lib/config/publicEnv';
import { FREE_PLAN_ID } from '@/constants/plans';
import Loader from '@/components/Loader';

interface PricingClientWrapperProps {
  plans: ISafePlan[];
}

type PayPalSubscriptionActions = {
  subscription: {
    create: (data: { plan_id: string; custom_id?: string }) => Promise<string>;
  };
};

const PricingClientWrapper = ({ plans }: PricingClientWrapperProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [{ isPending }] = usePayPalScriptReducer();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<ISafePlan | null>(null);

  const handleChoosePlan = (plan: ISafePlan) => {
    if (plan.plan_id === FREE_PLAN_ID) {
      router.push(PRIVATE_ROUTE.DASHBOARD);
    } else {
      setSelectedPlan(plan);
      setIsDialogOpen(true);
    }
  };

  const handleSubscriptionCreate = async (
    _data: Record<string, unknown>,
    actions: PayPalSubscriptionActions
  ): Promise<string> => {
    try {
      if (!selectedPlan?.plan_id) {
        throw new Error('No plan selected for subscription.');
      }

      const requestPayload = {
        plan_id: selectedPlan.plan_id,
        custom_id: session?.user?.id
      };
      const subscriptionId = await actions.subscription.create(requestPayload);
      return subscriptionId;
    } catch (error) {
      throw new Error('Failed to initiate subscription. Please try again.');
    }
  };

  const handleSubscriptionApprove = async (data: OnApproveData): Promise<void> => {
    if (!data.subscriptionID) {
      throw new Error('Missing subscription ID in PayPal response.');
    }

    try {
      const payload = {
        subscriptionId: data.subscriptionID,
        planId: selectedPlan?.plan_id
      };

      const response = await apiService.post<ApiResponse<ISubscriptionCreateResponse>>(
        PRIVATE_API_ROUTES.SUBSCRIPTION_CREATE_API,
        payload,
        { withAuth: true }
      );

      toast.success(response.data.message || 'Subscription created successfully!');
      setIsDialogOpen(false);
    } catch (err) {
      const error = err as AxiosError<ApiResponse<null>>;
      const apiErrorMessage =
        error?.response?.data?.error?.message ||
        error?.message ||
        'Something went wrong.';
      toast.error(apiErrorMessage);
    }
  };

  const handleSubscriptionError = (error: any) => {
    const errorMessage = error.message || '';
    if (errorMessage.includes('popup close')) return;

    if (
      errorMessage.includes('INSTRUMENT_DECLINED') ||
      errorMessage.includes('payment_method_error')
    ) {
      toast.error('Your payment method was declined. Please try another.');
    } else if (
      errorMessage.includes('unsupported') ||
      errorMessage.includes('currency_not_supported') ||
      errorMessage.includes('country_not_supported')
    ) {
      toast.error('This payment option is not supported. Please choose a different one.');
    } else if (
      errorMessage.includes('INVALID_REQUEST') ||
      errorMessage.includes('system_config_error') ||
      errorMessage.includes('invalid_payment_method')
    ) {
      toast.error('There was a configuration issue. Contact support.');
    } else {
      toast.error('An unexpected error occurred. Please try again later.');
      console.error('[PayPal Unknown Error]', error);
    }
  };

  return (
    <div className="flex w-full flex-wrap justify-center gap-8">
      <Loader isLoading={isPending} />
      {plans.map((plan) => (
        <PlanCard
          key={plan.plan_id}
          plan={plan}
          onChoosePlan={() => handleChoosePlan(plan)}
        />
      ))}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl p-8">
          <DialogHeader>
            <DialogTitle className="font-[Outfit] text-2xl font-bold">
              Subscribe to the {selectedPlan?.name} plan?
            </DialogTitle>
            <div className="mt-8">
              {selectedPlan && (
                <div className="flex flex-col gap-2">
                  <PayPalButtons
                    style={PAYPAL_BUTTON_CONFIG}
                    fundingSource={FUNDING.PAYPAL}
                    // forceReRender={[selectedPlan.plan_id]}
                    createSubscription={handleSubscriptionCreate}
                    onApprove={handleSubscriptionApprove}
                    onError={handleSubscriptionError}
                  />
                  <PayPalButtons
                    fundingSource={FUNDING.CARD}
                    style={PAYPAL_BUTTON_CONFIG}
                    // forceReRender={[selectedPlan.plan_id]}
                    createSubscription={handleSubscriptionCreate}
                    onApprove={handleSubscriptionApprove}
                    onError={handleSubscriptionError}
                  />
                </div>
              )}
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PricingClientWrapper;
