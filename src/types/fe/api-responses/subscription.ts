import { Plan, Subscription } from '@prisma/client';

import { JsonSafe } from '@/lib/utils/safeJson';

export type ISafePlan = JsonSafe<Plan>;
export type ISafeSubscription = JsonSafe<Subscription>;
