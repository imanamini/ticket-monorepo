import {
  AppFormInsuranceCompanyModel
} from '../../../../data-access/models/application-form/app-form-insurance-company.model';
import { VehicleInfoModel } from '../../../../data-access/models/application-form/vehicle-info.model';

export interface PolicyDetailModel {
  insurerParty: AppFormInsuranceCompanyModel;
  carType: string;
  carModel: string;
  buildYear: string;
  license: string;
  duration: string;
  coverageRate: string;
  thirdPartyDiscount: string;
  driverDiscount: string;
  vehicle?: VehicleInfoModel;
}
