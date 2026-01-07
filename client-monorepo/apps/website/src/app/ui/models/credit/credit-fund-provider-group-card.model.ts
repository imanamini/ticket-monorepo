import { SubscriptionDetailModel } from './subscription-detail.model';
import { PlanRuleEnum } from './credit-plan-detail.response';

export interface CreditFundProviderGroupCardModel {
  fundProviderCode: number;
  fundProviderName: string;
  fundProviderIcon: string;
  fundProviderColor: string;
  interestPercentage: number;
  installmentAmount: number;
  installmentCount: number;
  allocationPrepaymentAmount: number;
  payableAmount: number;
  creditAmount: number;
  sumInstallmentAmount: number;
  allocationPrepaymentPercentage: number;
  priority?: number;
  collaterals: { name: string; type: string }[];
  hasAllocationPrepayment: boolean;
  paymentMethod: PAYMENT_METHOD;
  subscriptionDetail?: SubscriptionDetailModel;
  planRuleType: PlanRuleEnum;
  balance: {
    min: number;
    max: number;
  };
}

export enum PAYMENT_METHOD {
  ALLOCATION_PREPAYMENT,
  PURCHASE_PREPAYMENT,
  SUBSCRIPTION,
  NONE,
}
