import { PagingModel } from '../../../../../../data-access/models/paging.model';
import { VehicleInfo } from './application-form-motor-response.model';
import { PolicyStateModel } from '../../../../../policy/data-access/models/policy-state.model';
import { VEHICLE_POLICY_STATE_ENUM } from '../../../../../policy/data-access/enums/vehicle-policy-state.enum';
import { VEHICLE_BODY_POLICY_STATE_ENUM } from '../../../../../policy/data-access/enums/vehicle-body-policy-state.enum';
import { VEHICLE_ORDER_STATE_ENUM } from '../../../../../../data-access/enums/vehicle-order-state.enum';

export interface MotorPolicyResultModel {
  id: string;
  uniqueCode: string;
  trackingCode: number;
  policyNumber?: any;
  centralInsuranceId?: any;
  expiresAt?: any;
  fullName?: any;
  nationalCode?: any;
  mobile?: any;
  license?: any;
  insurerCompany: string;
  states: PolicyStateModel<(VEHICLE_POLICY_STATE_ENUM | VEHICLE_BODY_POLICY_STATE_ENUM), VEHICLE_ORDER_STATE_ENUM>;
  paidAt?: any;
  paymentMethod?: any;
  price: number;
  paidAmount: number;
  discountCode: string;
  discountAmount: number;
  priceConflictAmount?: any;
  priceConflictType: number;
  issuedAt?: any;
  canDownloadPolicy: boolean;
  vehicleInfo: VehicleInfo;
  completeJourneyDeadline?: any;
  providerOrderId?: any;
  createAt: number;
}

export interface ResponseMotorPolicyResultModel {
  data: MotorPolicyResultModel[];
  paging: PagingModel;
}
