import { SuperjsonSafe } from '@/lib/utils/safeJson';
import { Plan } from '@prisma/client';

export type ISafePlan = SuperjsonSafe<Plan>;

export interface ISubscriptionCreateResponse {
  subscriptionId: string;
  planId: string;
  nextBillingDate?: string;
}
