import { InsuranceCompanyModel } from '../available-products/insurance-company.model';
import { CarUsageModel } from './car-usage.model';
import { CarDataModel } from './car-data.model';

export interface ConstantAllModel {
  motorTypes: CarDataModel[];
  carTypes: CarDataModel[];
  carUsages: CarUsageModel[];
  insuranceCompanies: Partial<InsuranceCompanyModel>[];
  healthDamages: CarDataModel[];
  propertyDamages: CarDataModel[];
  driverDamages: CarDataModel[];
  driverDiscounts: CarDataModel[];
  thirdPartyDiscounts: CarDataModel[];
  coverageRates: CarDataModel[];
  durations: CarDataModel[];
  settings: {
    'thirdparty-show-plaque': boolean;
    'motor-show-plaque': boolean;
  };
}
