export interface ICheckoutRequest {
  orderId: number;
  callbackUrl?: string;
  clientMetadata?: string;
  isCrowdFunding: boolean;
  ipoPaymentMethod: string;
  symbol: string;
  amount: number;
}
