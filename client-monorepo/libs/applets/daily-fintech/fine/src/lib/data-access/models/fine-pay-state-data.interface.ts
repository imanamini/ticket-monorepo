import { InquiryType } from '@client-monorepo/daily-fintech/vehicle-data';

export interface FinePayStateDataInterface {
  trackingCode: string;
  inquiryType: InquiryType;
  amount: number;
  billId: string;
  paymentId: string;
}
