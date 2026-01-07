import { Plate } from '@client-monorepo/daily-fintech/vehicle-data';
import { VehicleType } from './vehicle-type';
import { InquiryType } from './inquiry-type';

export interface FinePlate {
  plateId: string;
  plateNo: string;
  plainPlateNo: string;
  vehicleDetail: {
    title: string;
    code: number;
  };
  title: string;
  plateDetail?: Plate;
  vehicleType: VehicleType;
  owner?: {
    name: string;
    userId: string;
  };
  inquiryType?: InquiryType;
  description: string;
  descriptionImageId: null;
  totalDebtAmount: number;
  inquiryTrackingCode: string;
}
