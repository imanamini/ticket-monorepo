import { BaseApiResponse } from '../../../../api/models/base-api.response';

export interface GetMerchantsResponse extends BaseApiResponse {
  totalRemainingCreditAmount: number;
  merchants: Merchant[];
  businessRegistrationUrl: string;
  businessSettlementUrl: string;
}

export interface Merchant {
  creditId: string;
  fundProvider: string;
  status: MerchantsStatus;
  imageId: string;
  legacy: boolean;
  maxCreditAmount: number;
  registrationStatus: string;
  remainingCreditAmount: number;
  businessRegistrationUrl: string;
  title: string;
}

export enum MerchantsStatus {
  PENDING,
  APPROVED,
  REJECTED,
  CANCELED
}
