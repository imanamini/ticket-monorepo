export interface HouseIncidentPaymentResultModel {
  isSuccess: boolean;
  isHybrid: boolean;
  trackingCode: number;
  paymentTrackingCode: string;
  applicationFormId: string;
  referrer: string;
  paymentRequestType: number;
  journeyType: string;
  providerId: string;
  paidAmount: number;
  taxAmount: number;
  transactionType: string;
  discountCode: string | null;
  discountAmount: number;
  businessId: string;
  ticketType: string;

}
