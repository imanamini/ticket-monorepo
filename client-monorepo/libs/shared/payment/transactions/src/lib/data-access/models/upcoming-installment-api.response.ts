import { ApiResultInterface } from '@client-monorepo/common/network';
import { PaymentType } from './payment-type.enum';
import { ContractDebt } from './payment';

export interface UpcomingInstallmentApiResponse {
  result: ApiResultInterface;
  paymentList: {
    paymentType: PaymentType;
    payload: UpcomingInstallmentApiResponsePayload;
  }[];
}

export interface UpcomingInstallmentApiResponsePayload {
  creditId: string;
  isOverdue: boolean;
  fundProviderName: string;
  fundProviderTitle: string;
  serviceType: number;
  contractDebts: ContractDebt[];
}
