import { PaymentRequestTypeEnum } from '../../../enums/payment-request-type.enum';

export interface VehiclePaymentResultModel {
  isSuccess: boolean;
  applicationFormId: string;
  paymentTrackingCode: string;
  trackingCode: string;
  isHybrid: boolean;
  referrer?: string;
  paymentRequestType: PaymentRequestTypeEnum;
  providerId: string;
  paidAmount: number;
  taxAmount: number;
  transactionType: string;
  discountCode: string | null;
  discountAmount: number;
  businessId: string;
  ticketType: string;
  journeyType: string;
}
