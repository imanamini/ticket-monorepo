export interface OrderDetailResponse {
  amount: number;
  type: string;
  state: string;
  instrumentId: number;
  instrumentSymbol: string;
  instrumentName: string;
  customerId: number;
  customerNationalId: string;
  instrumentUnit: number;
  remoteOrderId: string;
  orderId: number;
}
