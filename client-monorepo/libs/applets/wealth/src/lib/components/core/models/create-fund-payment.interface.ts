export interface ICreateFundPayment {
  orderId: number;
  type: string;
  state: string;
  instrumentId: number;
  instrumentSymbol: string;
  instrumentName: string;
  instrumentProvider: string;
  instrumentUnit: number;
  customerId: number;
  customerNationalId: string;
  remoteOrderId: string;
  investmentType?: string;
  amountBreakdown: IAmountBreakdown;
  amountRounded?: boolean;
  usedBrokerCredit?: boolean;
  date: string;
  isIPO?: boolean;
  ipoPaymentMethod?: string;
}

export interface IAmountBreakdown {
  baseAmount: number;
  commission: number;
  walletPayableAmount: number;
  totalPayableAmount: number;
  ipgPayableAmount: number;
}
