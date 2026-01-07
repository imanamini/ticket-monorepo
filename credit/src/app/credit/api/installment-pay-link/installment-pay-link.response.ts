import { ApiResponse } from '../api-response.model';

export interface InstallmentPayLinkResponse extends ApiResponse {
  totalDebt: number; // Contains penalty and penaltyWaiver in itself
  totalPenalty: number;
  totalPenaltyWaiver: number;
  clearAmount?: number;
  unPaidInstallments: UnPaidInstallment[];
  fundProviderDto: FundProviderDto;
  fullName: string;
  isCutOffTime: boolean;
}

interface UnPaidInstallment {
  amount: number;
  penaltyAmount: number;
  penaltyWaiverAmount: number;
  effectiveDate: number;
  order: number;
  contractTrackingCode: string;
  payableInstallmentsLimit?: number;
}

interface FundProviderDto {
  businessId: string;
  name: string;
  title: string;
}
