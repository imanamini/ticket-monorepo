import { SERVICE_TYPE } from '@client-monorepo/payment/transactions';

export interface PayInstallmentPayload {
  creditId?: string;
  params?: { [key: string]: string | number | boolean };
  serviceType: SERVICE_TYPE;
  ticketDetail?: {
    trackingCode: string;
    count: number;
    amount: number;
  }[];
}

export const serviceTypeMapper: { [key in SERVICE_TYPE]: string } = {
  [SERVICE_TYPE.BNPL]: 'bnpl',
  [SERVICE_TYPE.CREDIT]: 'credit',
  [SERVICE_TYPE.INSTALLMENT_SALE]: '',
};
