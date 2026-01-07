import { PreviousInsuranceCompany } from './previous-Insurance-company';
import { InsuranceCompany } from './insurance-company.model';
import { Price } from './price.model';
import { PolicyStateModel } from '../../../../../policy/data-access/models/policy-state.model';
import { VEHICLE_ORDER_STATE_ENUM } from '../../../../../../data-access/enums/vehicle-order-state.enum';
import { VEHICLE_POLICY_STATE_ENUM } from '../../../../../policy/data-access/enums/vehicle-policy-state.enum';
import { VehicleInfoModel } from '../../application-form/vehicle-info.model';
import { InsuranceDetailModel } from '../../application-form/insurance-detail.model';
import { AppFormInsuranceCompanyModel } from '../../application-form/app-form-insurance-company.model';

export interface VehiclePolicyDetailResultModel {
  applicationFormId: number;
  license: string;
  vehicleInfo: VehicleInfoModel;
  previousInsuranceDetail: InsuranceDetailModel;
  uniqueCode: string;
  trackingCode: number;
  insuranceCompany: InsuranceCompany;
  price: Price;
  states: PolicyStateModel<VEHICLE_POLICY_STATE_ENUM, VEHICLE_ORDER_STATE_ENUM>;
  currentInsuranceCompany: AppFormInsuranceCompanyModel;
  nationalCode: string;
}


