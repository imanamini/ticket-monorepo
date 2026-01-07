import { ApiResponse } from '../api-response.model';

export enum CreditPurchaseFeatures {
  PAYMENT_CPG = '3',
  PAYMENT_BPG = '4',
  PAYMENT_CAPG5 = '5',
  PAYMENT_ISPG = '7',
}

export enum FeatureIsProtected {
  NOT_NEEDED,
  PIN,
  OTP,
  IN_APP_OTP,
  VERIFICATION,
}

export interface Feature {
  editable: boolean;
  isProtected: FeatureIsProtected;
  title: string;
  url: string;
}

export interface InAppTacResponse extends ApiResponse {
  shouldAcceptTac: boolean;
  tacUrl: string;
  userDetail: {
    userId: string,
    cellNumber: string,
    active: boolean
  };
  features: {
    [key: string]: Feature
  };
  gateways: Array<number>;
  transactionType?: number;
}
