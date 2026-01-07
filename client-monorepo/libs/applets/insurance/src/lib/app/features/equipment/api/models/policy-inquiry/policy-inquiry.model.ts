import { ElectronicEquipment, Entity, PolicyHolder, PolicyModel } from '../policy/policy.model';

export enum PolicyInquiry {
  loginUser,
  policyHolder,
  policyPure,
  hasLeadHasTime,
  hasLeadRenew,
  HasLeadTimeLost,
  noPolicy,
  registerUser
}

export interface InquiryResponseModel {
  hasPolicy: boolean;
  isPolicyOwner: boolean;
  policyNumber: number;
  hasProfile: boolean;
  hasPurchase: boolean;
  policy: PolicyModel;
  purchases: Purchase[];
}

export interface Purchase {
  code: string;
  expireDays: number;
  expiresAtDate: string;
  expiresAt: number;
  orderedAtDate: string;
  orderedAt: number;
  renewAllowed: boolean;
  policyHolder: PolicyHolder;
  electronicEquipment: ElectronicEquipment;
  policyType: Entity;
  policyStatus: Entity;
}
