export interface IOrderResponse {
  type: string;
  state: string;
  instrumentName: string;
  instrumentSymbol: string;
  customerNationalId: string;
  instrumentProvider: string;
  orderId: number;
  customerId: number;
  instrumentId: number;
  instrumentUnit: number;
  amountBreakdown: IOrderResponseAmountBreakdown;
}

export interface IOrderResponseAmountBreakdown {
  baseAmount: number;
  commission: number;
  ipgPayableAmount: number;
  totalPayableAmount: number;
  walletPayableAmount: number;
}
