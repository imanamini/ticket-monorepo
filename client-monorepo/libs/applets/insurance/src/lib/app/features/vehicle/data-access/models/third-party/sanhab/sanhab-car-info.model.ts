import { SanhabCarBrandModel } from './sanhab-car-brand.model';
import { CarDataModel } from '../constant-all/car-data.model';

export interface SanhabCarInfoModel {
  carType: CarDataModel;
  carBrand: SanhabCarBrandModel;
  carModel: CarDataModel;
  buildYear: string;
  carUsage: CarDataModel;
  isIncludeNullData: boolean;
  vehicleOwnershipChanged: boolean;
}
