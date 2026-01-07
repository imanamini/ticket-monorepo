export interface ICreatePaymentResult {
  instrumentName: string;
  method: string;
  params: string;
  remoteOrderId: number;
  url: string;
  instrumentSymbol: string;
  investmentType: string;
  metadata: any;
}
