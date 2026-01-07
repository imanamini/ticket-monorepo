import { EQUIPMENT_POLICY_STATE_ENUM } from '../enums/equipment-policy-state.enum';

export interface EquipmentPolicyListModel {
  id: string;
  category: string;
  brand: string;
  model: string;
  policyDraftNo: string;
  expiresAt?: string;
  identifier?: EQUIPMENT_POLICY_STATE_ENUM;
  link?: string;
  uniqueCode?: string;
}
