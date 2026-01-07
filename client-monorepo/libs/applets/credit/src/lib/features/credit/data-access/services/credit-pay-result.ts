export interface CreditPayResult {
  payUrl: string;
  fallbackUrl: string;
  ticket: string;
  amount: number;
  callbackUrl: string;
  relativeCallbackUrl: string;
  relativeAfterResultUrl: string;
  preferredMethod?: string;
}
