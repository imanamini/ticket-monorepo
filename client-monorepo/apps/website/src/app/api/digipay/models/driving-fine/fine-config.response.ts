import { VehiclePlateDetails } from './vehicle-plate';
import { InquiryMethodType } from './inquiry-method';
import { GenericApiResponse } from '../generic-api-response.model';
import { InquiryType } from './type/inquiry-type';

export interface FineConfigResponse extends GenericApiResponse {
  landingConfig: FineLandingConfig;
  plateDetails: VehiclePlateDetails[];
  user: FineUser;
}

export interface FineUser {
  cellNumber: string;
  name: string;
  nationalCode: string;
  userId: string;
}

export interface FineLandingConfig {
  title: string;
  bannerImageId: string;
  campaignInfo: {
    title: string;
    type: number;
    isEnable: boolean;
  };
  tacInfo: {
    title: string;
    url: string;
    isEnable: boolean;
  };
  description: Description;
  barcodeIcon: string;
  colors: number[];
  paidFineTitle: string;
  payDescription: Description;
  fineListDescription: Description[];
  addPlateDescription: Description;
  addBarcodeDescription: Description;
  inquiryInfoDescription: Description;
  payTitle: string;
  payIcon: string;
  inquiryAmount: number;
  inquiryPayDescription: Description;
  inquiryMethods: InquiryMethodData[];
}

export interface Description {
  note: string;
  keywords: string[];
}

export interface InquiryMethodData {
  type: InquiryMethodType;
  title: string;
  description: string;
  hoverImageId: string;
  imageId: string;
}

export interface TrafficFinesDto {
  fines: Fine[];
  totalAmount: {
    amount: number;
    color: number;
    title: string;
    image: string;
  };
  reportAlert?: ReportAlert;
  plateDetail: VehiclePlateDetails;
  plainPlateNo: string;
  plateNo: string;
  vehicleType: number;
  vehicleImageId: string;
  billId: string;
  inquiryType: InquiryType;
  owner?: {
    userId: string;
    name: string;
  };
}

export interface ReportAlert {
  title: string;
  textColor: number;
  backgroundColor: number;
  imageId: string;
  descriptionItems: Description[];
  actionTitle: string;
}

export interface Fine {
  fineType: number;
  title: string;
  imageId: string;
  status: FineStatus;
  statusText: string;
  fineDetail: FineDetail;
  color: number;
  alertDto: {
    actionTitle: string;
    backgroundColor: number;
    description: {
      keywords: string[];
      note: string;
    };
    imageId: string;
    textColor: number;
  };
  hasImage: boolean;
  violationId: string;
}

export enum FineStatus {
  PAID = 0,
  READY_TO_PAY = 1,
  NOT_PAYABLE = 2,
}

export interface FineDetail {
  location: string;
  fineDate: number;
  date: number;
  fineDateSimpleText?: string;
  dateSimpleText: string;
  city: string;
  amount: number;
  billId: string;
  paymentId: string;
  desc: string;
}
