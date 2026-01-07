import { WritableSignal } from '@angular/core';
import { ConfigPaymentFlow } from '../../data-access/models/credit/installment/installment-pay-config.response';

export interface InstallmentsOverviewCredit {
  clearAmount?: number;
  discountAmount: number;
  contractTrackingCode: string;
  contractTotalInstallmentsCount: number;
  paymentFlow: ConfigPaymentFlow;
  maxLimitAmount: number;
  maxPayableInstallmentOrder: number;
  fundProvider: {
    businessId: string;
    englishName: string;
    name: string;
  };
  installments: InstallmentsOverviewCreditInstallment[];
}

export interface InstallmentsOverviewCreditInstallment {
  checked: WritableSignal<boolean>;
  isDue: boolean;
  order: number;
  amount: number;
  penalty: number;
  penaltyWaiverAmount: number;
  fee: number;
  title: string;
  subtitle: string;
  deActive?: boolean;
}
