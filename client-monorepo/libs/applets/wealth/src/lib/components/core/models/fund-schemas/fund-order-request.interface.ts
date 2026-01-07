export interface IOrderRequest {
  amount: number;
  units?: number;
  symbol: string;
  instrumentUnit: number;
  ipoPaymentMethod: string;
}
