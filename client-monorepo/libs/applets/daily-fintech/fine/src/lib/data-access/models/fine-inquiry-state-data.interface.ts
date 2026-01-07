import { FineConfigResponse, InquiryType, VehicleType } from '@client-monorepo/daily-fintech/vehicle-data';

export interface FineInquiryStateDataInterface {
  plateNo: string;
  inquiryType: InquiryType;
  type: VehicleType;
  config: FineConfigResponse;
}
