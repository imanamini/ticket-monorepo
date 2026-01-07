export interface DisabledWalletMessage {
  fieldName: string;
  text: string;
}

export interface CreditWallet {
  amountEditable: boolean;
  creditId: string;
  balance: number;
  purchaseAmount: number;
  installmentCount: number;
  installmentAmount: number;
  prepaymentAmount: number;
  prepaymentPercent: number;
  feeCharge: number;
  feeChargePercent: number;
  payableAmount: number;
  fundProvider: {
    fundProviderCode: number,
    title: string,
    businessId: string,
    icon: string,
  };
  disable: boolean;
  messages: DisabledWalletMessage[];
  cellNumber: string;
  totalAmount: number;
  cashPayAmount: number;
  creditAmount: number;
  creditInterest: number;
  withdrawalBalance: number;
  minimumCreditAmount: number;
  color: string;
  hasContract: boolean;
  maskedPan?: string;
  generateInvoice: boolean;
  fpFeeCharge: number;
  feeChargePayInCash: boolean;
  fpFeeChargePayInCash: boolean;
  minimumCashPayAmount: number;

  // These are not exist in purchase info response
  installmentFee: number;
  installmentPreviews: InstallmentPreview[];
  couponAmount?: number;
}

export interface InstallmentPreview {
  order: number;
  amount: number;
  date: number;
  feeAmount?: number;
}
