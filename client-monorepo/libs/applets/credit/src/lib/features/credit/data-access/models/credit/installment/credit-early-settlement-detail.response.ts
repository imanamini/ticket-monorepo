import { GenericApiResponse } from '../../generic-api-response.model';

export interface CreditEarlySettlementDetailResponse extends GenericApiResponse {
  maxAmount: number;
  minAmount: number;
  label: string;
  creditId: string;
  icon: string;
  billingCycleStartDate: number;
  billingCycleEndDate: number;
  installmentPreviews?: InstallmentPreview[];
  partialPaymentEnable: boolean;
  earlySettlementSideNotes: {
    title: string;
    notes: string[];
  };
}

export interface InstallmentPreview {
  amount: number;
  date: number;
  order: number;
  feeAmount?: number;
}
