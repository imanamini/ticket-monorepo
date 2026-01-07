export interface PaymentOrderDetail {
  trackingCode: string;
  effectiveDate: number;
  amount: number;
  order: number;
  status: number;
  settlementAmount: number;
  messages: Array<{
    text: string;
    colorRange: Array<number>;
  }>;
}
