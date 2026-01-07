import { ApiResponse } from '../api-response.model';

export type CreditOfferType = 'CREDIT' | 'BNPL';

export interface CreditOfferItem {
  message: {
    text: string;
  };
  creditOfferType: CreditOfferType;
}

export interface OfferInfoResponse extends ApiResponse {
  creditOfferList: CreditOfferItem[];
}
