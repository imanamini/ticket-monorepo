import { SERVICE_TYPE } from '../../../data-access/models/credit/service-type/service-type.model';
import { SubscriptionDetailModel } from '../../../data-access/models/credit/pre-registration/subscription-detail.model';
import { PAYMENT_METHOD } from '../../../data-access/models/credit/pre-registration/payment-method.model';
import { PlanRuleEnum, USER_ENTRY_POINT } from '../../../data-access/models/credit/pre-registration/credit-plan-group';

export interface CreditFundProviderGroupCardModel {
  fundProviderCode: number;
  fundProviderName: string;
  fundProviderIcon: string;
  fundProviderColor: string;
  interestPercentage: number;
  installmentAmount: number;
  installmentCount: number;
  allocationPrepaymentAmount: number;
  allocationPrepaymentPercentage: number;
  payableAmount: number;
  creditAmount: number;
  collateralAmount: number;
  sumInstallmentAmount: number;
  serviceType: SERVICE_TYPE;
  priority: number;
  collaterals: { name: string; type: string }[];
  hasAllocationPrepayment: boolean;
  paymentMethod?: PAYMENT_METHOD;
  subscriptionDetail?: SubscriptionDetailModel;
  planRuleType: PlanRuleEnum;
  balance?: {
    min: number;
    max: number;
  };
  userEntryPoint?: USER_ENTRY_POINT;
}
