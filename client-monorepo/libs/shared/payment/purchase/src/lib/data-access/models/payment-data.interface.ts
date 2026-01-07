export interface PaymentDataInterface {
  ticket: string;
  amount: number;
  homeUrl: string;
  redirectUrl?: string;
  payUrl?: string;
  fallbackUrl?: string;
  callbackUrl?: string;
  relativeCallbackUrl?: string;
  relativeAfterResultUrl?: string;
  preferredMethod?: string;
}
