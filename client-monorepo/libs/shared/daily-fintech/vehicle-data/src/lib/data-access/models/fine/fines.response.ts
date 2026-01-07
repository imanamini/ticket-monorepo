import { GenericApiResponse } from '@client-monorepo/common/network';
import { Plate } from '@client-monorepo/daily-fintech/vehicle-data';
import { InquiryType } from './inquiry-type';
import { Description } from './fine-landing-config';
import { Fine } from './fine';

export interface FinesResponse extends GenericApiResponse {
  trafficFinesDto: TrafficFinesDto;
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
  plateDetail: Plate;
  plainPlateNo: string;
  plateNo: string;
  vehicleType: number;
  vehicleImageId: string;
  billId: string;
  inquiryType: InquiryType;
  paymentId: string;
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
