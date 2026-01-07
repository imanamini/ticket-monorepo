import { GenericApiResponse } from '../../data-access/models/generic-api-response.model';
import { FeeDetails } from '../../data-access/models/credit/installment/fee';
import { SERVICE_TYPE } from '../../data-access/models/credit/service-type/service-type.model';
import { ConfigPaymentFlow } from '../../data-access/models/credit/installment/installment-pay-config.response';

export interface GetInstallmentsOverviewResponse extends GenericApiResponse {
  installmentDebt: InstallmentDebt[];
  userInstallmentSummary: {
    serviceTypeInstallments: ServiceTypeInstallment[];
  };
}

interface InstallmentDebt {
  count: number;
  contractTrackingCode: string;
  creditId: string;
  billingCycleInfo?: BillingCycleInfo;
  penaltyPercentagePerDay: number;
  installments: Installment[];
  feeDetails: FeeDetails;
  maxLimitAmount: number;
  payableInstallmentsLimit?: number;
  discountAmount?: number;
  clearAmount?: number;
  fundProvider: {
    businessId: string;
    name: string;
    englishName: string;
    paymentFlow: ConfigPaymentFlow;
  };
}

export interface BillingCycleInfo {
  startDate: number;
  endDate: number;
  merchantsBusinessIds: string[];
}

export interface Installment {
  amount: number; // contains penalty and penaltyWaiver
  penalty: number;
  penaltyWaiverAmount: number;
  fee: number;
  order: number;
  isDue: boolean;
  dueDate: number;
  gracePeriodRemain: number;
  penalizeStartDate: number;
}

export interface ServiceTypeInstallment {
  serviceType: SERVICE_TYPE;
  dueInstallmentCount: number;
}
