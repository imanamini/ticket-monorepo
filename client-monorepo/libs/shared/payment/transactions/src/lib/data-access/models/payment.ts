import { PaymentType } from './payment-type.enum';
import { Bill } from '@client-monorepo/daily-fintech/bill';

export enum SERVICE_TYPE {
  BNPL,
  CREDIT,
  INSTALLMENT_SALE,
}

export type Payment = {
  paymentType: PaymentType;
  payload: UpcomingScheduledPayload | UpcomingInstallmentPayload | UpcomingBillPayload | FrequentC2CPayload | FrequentBundlePayload;
};

export type UpcomingScheduledPayload = {
  payload: string | InnerPayload;
  nextRunDate: number;
};

export type UpcomingBillPayload = {
  payload: {
    billInfo: Bill;
  };
};

export type UpcomingInstallmentPayload = {
  creditId: string;
  isOverdue: boolean;
  fundProviderName: string;
  fundProviderTitle: string;
  serviceType: SERVICE_TYPE;
  contractDebts: ContractDebt;
};

export type ContractDebt = {
  totalAmount: number;
  penaltyAmount: number;
  daysToPenalized: number;
  ticketDetail: TicketDetail[];
  effectiveDate?: number;
};

export type TicketDetail = {
  trackingCode: string;
  count: number;
  amount: number;
  clear: boolean;
};

export type FrequentBundlePayload = {
  data: {
    internetPackage: InternetPackage;
    topUpRecommendation: TopUpRecommendation;
    operator: Operator;
  };
};

export type FrequentC2CPayload = {
  id: string;
  info: Array<LabelValue>;
  subTitle: string;
  title: string;
};

export type InnerPayload = {
  targetedCellNumber: string;
  operatorId: number;
  chargeType: number;
  chargePackage: { amount: number };
  color: number[];
  chargeTypeDesc: string;
  imageId: string;
};

type LabelValue = {
  label: string;
  value: string;
};

export interface InternetPackage {
  bundleId: string;
  amount: number;
  duration: number;
  description: string;
  needApproval: boolean;
}
export interface TopUpRecommendation {
  id: string;
  title: string;
  imageId: string;
  pinned: boolean;
  colors?: number[] | null;
  operator: number;
  cellNumberType: number;
}
export interface Operator {
  imageId: string;
  name: string;
  description: string;
  operatorId: string;
  operator: number;
  prefixes?: PrefixesEntity[] | null;
  colorRange?: number[] | null;
}
export interface PrefixesEntity {
  value: string;
  types?: number[] | null;
}
