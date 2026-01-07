import { PaymentRequestTypeEnum } from '../../../../../vehicle/data-access/enums/payment-request-type.enum';

export interface HouseIncidentGoToPaymentModel {
  isHybrid: boolean;
  origin: string;
  referrer: string;
  paymentRequestType: PaymentRequestTypeEnum;
}

export interface HouseIncidentGoToPaymentResponseModel {
  paymentUrl: string;
  providerId: string;
}
