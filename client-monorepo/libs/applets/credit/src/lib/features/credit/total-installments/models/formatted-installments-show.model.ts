import { BillingCycleDate, Installment } from '../../data-access/models/credit/total-installments/total-installments';
import { FeeDetails } from '../../data-access/models/credit/installment/fee';

export interface FormattedInstallmentsShowModel {
  dueInstallments?: InstallmentWithContractInfo[];
  currentInstallments?: InstallmentWithContractInfo[];
}

export interface InstallmentWithContractInfo extends Installment {
  contract: {
    contractTrackingCode: string;
    billingCycleDate?: BillingCycleDate;
    count: number;
    penaltyPercentagePerDay: number;
    feeDetails: FeeDetails;
  };
}
