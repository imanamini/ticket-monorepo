import { SUBSCRIPTION_STATUS } from './subscription-status';
import { GenericApiResponse } from '../../../generic-api-response.model';
import { ALLOCATION_PAYMENT_METHOD } from '../../pre-registration/credit-plan-group';

export interface SubscriptionStatusResponse extends GenericApiResponse {
  status: SUBSCRIPTION_STATUS;
  detail: SubscriptionDetail;
}

export interface SubscriptionDetail {
  subscriptionPlanId: string;
  type: string;
  title: string;
  durationInMonth: number;
  delayRemainingDays: number;
  initialBalance: number;
  amount: number;
  allocationPaymentMethodType: ALLOCATION_PAYMENT_METHOD;
  hasIncompatiblePlan: boolean;
  stampPrice?: number;
}
