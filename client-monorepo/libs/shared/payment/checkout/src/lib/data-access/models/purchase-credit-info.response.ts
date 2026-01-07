import { ApiResultInterface } from '@client-monorepo/common/network';

export interface PurchaseCreditInfoResponse {
  result: ApiResultInterface;
  remainingMinutes: number;
  imageId: string;
  businessTitle: string;
  cancelRedirect: CreditCancelRedirectInterface;
  creditDetails: CreditDetailsInterface[];
  ticketType: number;
  amount: number;
}

export interface CreditCancelRedirectInterface {
  url: string;
  redirectMethod: string;
  data: string;
}

export interface CreditDetailsInterface {
  balance: number;
  withdrawalBalance: number;
  purchaseAmount: number;
  installmentCount: number;
  prepaymentAmount: number;
  cashPayAmount: number;
  creditAmount: number;
  creditInterest: number;
  feeCharge: number;
  fpFeeCharge: number;
  feeChargePayInCash: boolean;
  fpFeeChargePayInCash: boolean;
  payableAmount: number;
  minimumCreditAmount: number;
  minimumCashPayAmount: number;
  fundProvider: CreditFundProviderInterface;
  disable: boolean;
  messages: [];
  color: string;
  creditId: string;
  instantFinalization: boolean;
  generateInvoice: boolean;
  basketId?: string;
  installmentPreviews: CreditInstallmentPreviewInterface[];
  installmentFee: number;
  amountEditable: boolean;
}

export interface CreditFundProviderInterface {
  fundProviderCode: number;
  title: string;
  businessId: string;
  icon: string;
}

export interface CreditInstallmentPreviewInterface {
  order: number;
  amount: number;
  feeAmount: number;
  date: number;
}
