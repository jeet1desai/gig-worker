import { Plan, Subscription, User } from '@prisma/client';

import { JsonSafe } from '@/lib/utils/safeJson';

export type ISafePlan = JsonSafe<Plan>;
export type ISafeActiveSubscription = JsonSafe<Subscription>;
export type ISafeSubscription = {
    subscription: JsonSafe<Subscription>,
    user: JsonSafe<User>
};
