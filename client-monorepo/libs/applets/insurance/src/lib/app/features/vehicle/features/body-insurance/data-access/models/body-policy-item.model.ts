import { VEHICLE_BODY_POLICY_STATE_ENUM } from '../../../../../policy/data-access/enums/vehicle-body-policy-state.enum';

export interface BodyPolicyItemModel {
  hasPolicyFile: boolean;
  gifts?: any;
  paymentAmount: number;
  durationTotalDays: number;
  repurchasePossibility: boolean;
  expiring: boolean;
  needVisitationInformation: boolean;
  description?: any;
  visitMethodId: number;
  branchTitle?: any;
  branchLatinTitle?: any;
  insuranceRequestId: number;
  createDate: string;
  insInsuranceRequestId: number;
  fullName: string;
  insuranceTypeName: string;
  insuranceTypeId: number;
  insuranceTypeLatinName: string;
  requestStatus: string;
  companyName: string;
  payableAmount: number;
  issuanceDate?: any;
  actualAmount?: any;
  buyDate: string;
  durationTitle: string;
  companyUrl: string;
  statusCategoryLatinName: VEHICLE_BODY_POLICY_STATE_ENUM;
  title: string;
  shippingCode?: any;
}
