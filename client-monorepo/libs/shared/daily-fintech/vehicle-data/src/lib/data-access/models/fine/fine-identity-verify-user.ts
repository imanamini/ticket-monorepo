import { VehicleType } from './vehicle-type';

export interface FineIdentityVerifyUser {
  cellNumber: string;
  nationalCode: string;
  otpCode: string;
  vehicleType: VehicleType;
}
