import { RequestCardInsuranceRestrictsModel } from './request-card-insurance-restrictions.model';
import { RequestCardInsuranceOrderModel } from './request-card-insurance-order.model';

export interface RequestQueryInsuranceCardItemModel {
  orders?: RequestCardInsuranceOrderModel[];
  restrictions?: RequestCardInsuranceRestrictsModel[];
  carModelId?: number;
  carUsageId?: number;
  carTypeId?: number;
  carBrandId?: number;
  thirdPartyDiscountId?: number;
  driverDiscountId?: number;
  durationId?: number;
  coverageRateId?: number;
  propertyDamageId?: number;
  healthDamageId?: number;
  driverDamageId?: number;
  buildYear?: string;
  currentInsuranceId?: number;
  currentInsuranceDeadline?: number;
  currentInsuranceIssuanceDate?: number;
  vehicleOwnerChanged?: boolean;
  license?: string;
  sessionId?: string;
  nationalCode?: string;
  isSan?: boolean;
  jt?: string;
}
