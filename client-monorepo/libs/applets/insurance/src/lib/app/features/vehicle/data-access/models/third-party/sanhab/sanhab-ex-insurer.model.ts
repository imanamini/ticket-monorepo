import { SanhabInsurerDiscountModel } from './sanhab-insurer-discount.model';
import { SanhabInsurerCompanyModel } from './sanhab-insurer-company.model';
import { CarDataModel } from '../constant-all/car-data.model';

export interface SanhabExInsurerModel {
  company: SanhabInsurerCompanyModel;
  startDate: number;
  endDate: number;
  isIncludeNullData: boolean;
  insuranceNumber: string;
  thirdPartyDiscount: SanhabInsurerDiscountModel;
  driverDiscount: SanhabInsurerDiscountModel;
  healthDamage: CarDataModel;
  driverDamage: CarDataModel;
  propertyDamage: CarDataModel;
}
