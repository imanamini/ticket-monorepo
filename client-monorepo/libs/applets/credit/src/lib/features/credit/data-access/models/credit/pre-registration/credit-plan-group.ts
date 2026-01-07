import { SERVICE_TYPE } from '../service-type/service-type.model';
import { PAYMENT_METHOD } from './payment-method.model';
import { SubscriptionDetailModel } from './subscription-detail.model';

export interface PlanGroup {
  fundProvider: {
    fundProviderCode: number;
    name: string;
    active: boolean;
    icon: string;
    color: string;
  };
  collateralDto: {
    name: string;
    type: string;
    description: {
      header: string;
      body: string;
      bodyList: string[];
      footer?: string;
    };
  };
  planRegistrationFlowDto: {
    name: string;
    type: string;
    description: {
      header: string;
      body?: string;
      footer?: string;
    };
  };
  details: {
    order: number;
    description: {
      body: string;
      info?: {
        description: string;
      };
    };
  }[];
  installmentCount: number;
  installmentAmount: number;
  allocationPrepaymentAmount: number;
  allocationPrepaymentPercentage?: number;
  collateralAmount: number;
  filingPaymentAmount?: string;
  payableAmount: number;
  interestPercentage: number;
  creditAmount: number;
  groupId: string;
  planId: string;
  active: boolean;
  maxInstallmentAmount?: number;
  hasAllocationPrepayment: boolean;
  preRegisterWithDelay: boolean;
  sumInstallmentAmount?: number;
  priority?: number;
  serviceType: SERVICE_TYPE;
  paymentMethod?: PAYMENT_METHOD;
  allocationPaymentMethodType?: ALLOCATION_PAYMENT_METHOD;
  subscriptionDetail?: SubscriptionDetailModel;
  isSelected?: boolean;
  planRuleType: PlanRuleEnum;
  balance?: {
    min: number;
    max: number;
  };
  userEntryPoint?: USER_ENTRY_POINT;
}

export enum USER_ENTRY_POINT {
  OPERATION,
  USER,
  EXTERNAL,
  SYSTEM,
  WHITELIST,
}

export enum PlanRuleEnum {
  STATIC,
  DYNAMIC,
}

export enum ALLOCATION_PAYMENT_METHOD {
  PECUNIARY,
  PECUNIARY_CREDIT,
}
