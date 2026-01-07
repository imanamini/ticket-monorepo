import { PLANS_TYPE } from './plans-type.model';
import { SERVICES_TYPE } from './services-type.model';
import { SERVICE_STATUS } from './service-status.model';
import { SERVICE_PLAN_STATUS } from './service-plan-status';
import { SERVICES_TAGS_TYPE } from './services-tags-type.model';
import { PAYMENT_GATEWAY_MODEL } from './payment-gateway.model';
import { NgxBadgeMode, NgxBadgeStatus } from '@digipay/ngx-badge/lib/ngx-badge.type';

export interface SubscriptionPlan {
  uuid: string;
  type: PLANS_TYPE;
  title: string;
  active: boolean;
  order: number; //unused; order handles in Backend
  durationInMonth: number;
  refundDurationInDays: number;
  expirationDate?: string;
  expirationDateString?: string;
  selected?: boolean;
  amount: number;
  services: PlanServices[];
  hasGift: boolean;
  refundDetail: SubscriptionRefund;
  status: SERVICE_PLAN_STATUS;
}

export interface SubscriptionRules {
  title: string;
  steps: string[];
}

export interface PlanServices {
  type: SERVICES_TYPE;
  active: boolean;
  price: number; //unused
  amount: number;
  fee: number; //unused
  order: number;
  allocatedAmount?: number;
  errorContent?: ErrorCount;
  nextAction?: NextAction;
  level?: number;
  status: SERVICE_STATUS;
  hasGift: boolean;
  templateId?: string;
  title?: string;
  merchantCashbackList?: MerchantCashbackList[];
  tags: SERVICES_TAGS_TYPE[];
  cashbackPercentage?: number;
  maxCashbackPerPlan?: number;
  maxCashbackPerTransaction?: number;
  badge?: SubscriptionServiceBadge;
  isComing?: boolean;
}

export interface SubscriptionServiceBadge {
  status: NgxBadgeStatus;
  mode: NgxBadgeMode;
  content: string;
}

export interface SubscriptionRefund {
  isRefundable: boolean;
  isClosable: boolean;
  amount: number;
}
export interface MerchantCashbackList {
  businessId: string;
  businessTitle: string;
  amount: number;
  amountType: number;
  capMaxValue: number;
  capMaxCount: number;
  paymentGateway: PAYMENT_GATEWAY_MODEL[];
}

export interface ErrorCount {
  code: number;
  description: string;
  retryable: boolean;
}

export interface NextAction {
  title: string;
  description: string;
  nextUrl: string;
}
