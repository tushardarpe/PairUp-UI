export type BillingCycle = 'monthly' | 'yearly';

export interface CreateOrderRequest {
  membershipType: 'PairUp Pro' | 'PairUp Elite';
  duration: BillingCycle;
}
