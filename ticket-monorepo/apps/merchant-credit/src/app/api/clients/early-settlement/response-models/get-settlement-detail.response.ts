import { BaseApiResponse } from '../../../models/base-api.response';
import { CreditAllocationDetail } from '../basic-models/credit-allocation-detail';
import { SettlementStatus } from '../basic-models/settlement-status';

export interface GetSettlementDetailBase extends BaseApiResponse {
  settlement: {
    invoiceAmount: number;
    expectedCreditAllocation: CreditAllocationDetail;
    fundProvider: string;
    merchantName: string;
    journals: any[];
    trackingCode: string;
    dueDate: number;
    status: SettlementStatus;
    providerId: string;
  },
  status: string;
  imageId: string;
  header: {
    label: string;
    value: string;
  },
}

export type ActivityApiDetail = {
  [key: string]: {
    [key: string]: {
      value: string;
      copyable: boolean;
    }
  }
};

export type ActivityTransformedDetail = {
  key: string;
  value: string;
  copyable: boolean;
}[];

export interface GetSettlementDetailApiResponse extends GetSettlementDetailBase {
  color: number;
  details: ActivityApiDetail;
  businessSettlementUrl: string;
}

export interface GetSettlementDetailTransformedResponse extends GetSettlementDetailBase {
  color: string;
  details: ActivityTransformedDetail;
  businessSettlementUrl: string;
}
