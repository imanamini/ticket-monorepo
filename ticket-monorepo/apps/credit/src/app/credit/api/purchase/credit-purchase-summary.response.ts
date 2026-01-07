import { ApiResponse } from '../api-response.model';

export interface PurchaseSummaryItem {
  amount: number;
  label: string;
  currency: string;
  status: 'INITIATED' | 'SUCCESS' | 'PENDING' | 'FAILED';
}
export interface CreditPurchaseSummaryResponse extends ApiResponse {
  mainLabel: string;
  basketAmount: number;
  redirectUrl: string;
  buttonLabel: string;
  currencyLabel: string;
  message: {
    text: string;
  };
  summaryItems: PurchaseSummaryItem[];
}
