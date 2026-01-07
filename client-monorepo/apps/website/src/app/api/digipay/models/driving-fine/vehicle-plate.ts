import { VehicleType } from './type/vehicle-type';
import { InquiryType } from './type/inquiry-type';

export interface VehiclePlate {
  plateId: string;
  plateNo: string;
  plainPlateNo: string;
  vehicleDetail: {
    title: string;
    code: number;
  };
  title: string;
  plateDetail?: VehiclePlateDetails;
  vehicleType: VehicleType;
  owner?: {
    name: string;
    userId: string;
  };
  inquiryType?: InquiryType;
  description: string;
  descriptionImageId: null;
  totalDebtAmount: number;
  inquiryTrackingCode?: string;
}

export interface VehiclePlateDetails {
  code: string;
  color: string;
  fontColor: string;
  imageId: string;
  title: string;
}

export interface PlateColor {
  bgColor: string;
  textColor: string;
}
