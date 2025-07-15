export enum PAYPAL_SUBSCRIPTION_STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING'
}

export enum PAYPAL_SUBSCRIPTION_CANCEL_REASON {
  USER_REQUESTED = 'User requested cancellation',
  SWITCHING_PLAN = 'Switching to a other plan',
  FAILED_PAYMENT = 'Failed payment issues'
}
