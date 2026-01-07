import { ChargePackage } from '@client-monorepo/applets/top-up';

export interface BillParams {
  billId: string;
  payId: string;
  redirectUrl: string;
  billType?: string | number;
}

interface CongestionParams {
  plateNo: string;
  congestionDetails: number[];
  redirectUrl: string;
}

interface FineParams {
  amount: number;
  billId: string;
  payId: string;
  redirectUrl: string;
}

interface InquiryFineParams {
  plateNo: string;
  inquiryType: number;
  redirectUrl: string;
  inquiryResultCallbackUrl: string;
  vehicleType: any; // todo replace vehicleType after adding type
}

interface TollParams {
  billIds: string[];
  plateNo: string;
  redirectUrl: string;
}

interface InternetParams {
  targetedCellNumber: string;
  operatorId: number;
  internetPackage: {
    bundleId: string;
    amount: number;
    description: string;
    duration: number;
  };
  redirectUrl: string;
}

interface TopUpParams {
  chargeType: number;
  targetedCellNumber: string;
  chargePackage: ChargePackage;
  operatorId: string;
  redirectUrl: string;
  cellNumberType: number;
}

interface DonationParams {
  organization: string;
  amount: number;
  redirectUrl: string;
}

interface TaxiParams {
  institutionId: string;
  passengersCount: number;
  terminalId: string;
  amount: number;
  redirectUrl: string;
}

interface StaticOfflinePayment {
  uniqueNumber: string;
  amount: number;
  redirectUrl: string;
}

interface DynamicOfflinePayment {
  uniqueNumber: string;
  redirectUrl: string;
}

interface OldOfflinePayment {
  trackingCode: string;
  redirectUrl: string;
}

interface SubscriptionParams {
  uuid: string;
  redirectUrl: string;
  redirectDetail: {
    text: string;
    method: number;
    path: string;
  };
}

interface PaymentWithChannel {
  uniqueNumber: string;
  redirectUrl: string;
  paymentChannel: PaymentChannel;
}

export type TicketParams =
  | BillParams
  | FineParams
  | InquiryFineParams
  | TollParams
  | InternetParams
  | TopUpParams
  | DonationParams
  | CongestionParams
  | TaxiParams
  | StaticOfflinePayment
  | DynamicOfflinePayment
  | OldOfflinePayment
  | PaymentWithChannel
  | SubscriptionParams;

export enum PaymentChannel {
  API = 0,
  UPG = 1,
  SMART_POS = 2,
  QR = 3,
  ESCROW = 4,
  BARCODE = 5,
  LINUX_POS = 6,
  APP = 7,
  PAYMENT_LINK = 8,
}
