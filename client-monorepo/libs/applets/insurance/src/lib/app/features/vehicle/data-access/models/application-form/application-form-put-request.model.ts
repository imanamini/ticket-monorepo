import { AppFormInsuranceCompanyModel } from './app-form-insurance-company.model';
import { InsuranceDetailModel } from './insurance-detail.model';
import { VehicleInfoModel } from './vehicle-info.model';

export interface ApplicationFormPutRequestModel {
  applicationFormId: string;
  vehicleInfo?: VehicleInfoModel;
  previousInsuranceDetail?: InsuranceDetailModel;
  currentInsuranceCompany?: AppFormInsuranceCompanyModel;
  durationId?: number;
  coverageRateId?: number;
}
