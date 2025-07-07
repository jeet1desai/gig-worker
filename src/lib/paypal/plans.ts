import { paypalClient } from './paypalClient';
import { getPayPalAccessToken, getProductId } from './index';
import { PayPalPlan, PayPalPlansResponse } from '@/types/paypal';
import { endpoints } from '@/lib/config/endpoints';
import { SubscriptionPlanPayload } from '@/types/fe';
import { HttpStatusCode } from '@/enums/shared/http-status-code';

export async function listSubscriptionPlans(): Promise<PayPalPlan[]> {
  const accessToken = await getPayPalAccessToken();

  try {
    const response = await paypalClient.get<PayPalPlansResponse>(endpoints.payPalPlans, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Prefer: 'return=representation',
      },
      params: {
        page_size: 20,
        status: 'ACTIVE',
        sort_by: 'create_time',
        sort_order: 'desc',
        total_required: true,
      },
    });
    return response.data.plans;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch PayPal plans';
    throw new Error(message);
  }
}

export async function deleteSubscriptionPlan(plan_id: string): Promise<boolean> {
  const accessToken = await getPayPalAccessToken();

  try {
    const response = await paypalClient.post(
      `${endpoints.payPalPlans}/${plan_id}/deactivate`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    );
    if (response.status === HttpStatusCode.NO_CONTENT) {
      return true;
    }
    return false;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to delete PayPal plan';
    throw new Error(message);
  }
}

export async function createSubscriptionPlan(create_plan_details: SubscriptionPlanPayload): Promise<any> {
  const details = await getProductId();

  try {
    const payload = {
      product_id: details.id,
      name: create_plan_details.name,
      description: create_plan_details.description,
      status: 'ACTIVE',
      billing_cycles: [
        {
          frequency: {
            interval_unit: 'MONTH',
            interval_count: 1,
          },
          tenure_type: 'REGULAR',
          sequence: 1,
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: {
              value: create_plan_details.price,
              currency_code: 'USD',
            },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee: {
          value: '0',
          currency_code: 'USD',
        },
        setup_fee_failure_action: 'CANCEL',
        payment_failure_threshold: 2,
      },
      taxes: {
        percentage: '0',
        inclusive: true,
      },
    };
    const response = await paypalClient.post(`${endpoints.payPalPlans}`, payload, {
      headers: {
        Authorization: `Bearer ${details.access_token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (response.data && response.status === HttpStatusCode.CREATED) {
      return { data: response.data, message: 'Plan created successfully' };
    }
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to delete PayPal plan';
    throw new Error(message);
  }
}

export async function updateSubscriptionPlanDetails(
  plan_id: string,
  update_payload: {
    op: string;
    path: string;
    value: any;
  }[],
) {
  const accessToken = await getPayPalAccessToken();

  try {
    const response = await paypalClient.patch(`${endpoints.payPalPlans}/${plan_id}`, update_payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (response.status === HttpStatusCode.NO_CONTENT) {
      return true;
    }
    return false;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to delete PayPal plan';
    throw new Error(message);
  }
}
