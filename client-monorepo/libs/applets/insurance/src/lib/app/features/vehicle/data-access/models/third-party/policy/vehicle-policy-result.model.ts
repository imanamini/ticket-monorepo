import { PolicyStateModel } from '../../../../../policy/data-access/models/policy-state.model';
import { PagingModel } from '../../../../../../data-access/models/paging.model';
import { VehicleInfoResultModel } from './vehicle-info-result.model';
import { VEHICLE_ORDER_STATE_ENUM } from '../../../../../../data-access/enums/vehicle-order-state.enum';
import { VEHICLE_POLICY_STATE_ENUM } from '../../../../../policy/data-access/enums/vehicle-policy-state.enum';
import { VEHICLE_BODY_POLICY_STATE_ENUM } from '../../../../../policy/data-access/enums/vehicle-body-policy-state.enum';
import { InsuranceProductTypeEnum } from '../../../../../../data-access/enums/Insurance-product-type.enum';

export interface VehiclePolicyResultModel {
  data: VehiclePolicyModel[];
  paging: PagingModel;
}

export interface VehiclePolicyModel {
  id: string;
  states: PolicyStateModel<(VEHICLE_POLICY_STATE_ENUM | VEHICLE_BODY_POLICY_STATE_ENUM), VEHICLE_ORDER_STATE_ENUM>;
  vehicleInfo: VehicleInfoResultModel;
  uniqueCode: string;
  trackingCode: number;
  policyNumber: string;
  centralInsuranceId: string;
  expiresAt: number;
  fullName: string;
  nationalCode: string;
  mobile: string;
  license: string;
  insurerCompany: string;
  paidAt: number;
  paymentMethod: string;
  price: number;
  paidAmount: number;
  discountCode: string;
  discountAmount: number;
  priceConflictAmount: number;
  priceConflictType: number;
  issuedAt: number;
  canDownloadPolicy: boolean;
  completeJourneyDeadline: number;
  insuranceProductType: InsuranceProductTypeEnum;
  createAt: number;
}


