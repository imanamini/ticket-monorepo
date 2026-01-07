import { GenericApiResponse } from '../../generic-api-response.model';
import { FeeDetails } from '../installment/fee';

export interface TotalInstallmentsResponse extends GenericApiResponse {
  installmentDebt: InstallmentDebt[];
}

interface InstallmentDebt {
  count: number;
  contractTrackingCode: string;
  billingCycleDate?: BillingCycleDate;
  penaltyPercentagePerDay: number;
  installments: Installment[];
  feeDetails: FeeDetails;
}

export interface BillingCycleDate {
  startDate: number;
  endDate: number;
}

export interface Installment {
  amount: number;
  penalty: number;
  penaltyWaiverAmount: number;
  fee: number;
  order: number;
  isDue: boolean;
  dueDate: number;
  gracePeriodRemain: number;
  penalizeStartDate: number;
}
