import { VehicleType } from './vehicle-type';

export interface FineIdentityCheckUser {
  cellNumber: string;
  nationalCode: string;
  vehicleType: VehicleType;
}
