import { VehicleType } from '../driving-fine/type/vehicle-type';

interface BillParams {
  billId: string;
  payId: string;
  redirectUrl: string;
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
  vehicleType: VehicleType;
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

interface DonationParams {
  organization: string;
  amount: number;
  redirectUrl: string;
}

export type TicketParams = BillParams | FineParams | InquiryFineParams | TollParams | InternetParams | DonationParams | CongestionParams;
