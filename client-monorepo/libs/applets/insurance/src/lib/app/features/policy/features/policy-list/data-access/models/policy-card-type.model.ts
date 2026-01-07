import { EQUIPMENT_POLICY_STATE_ENUM } from '../../../../data-access/enums/equipment-policy-state.enum';
import { VEHICLE_POLICY_STATE_ENUM } from '../../../../data-access/enums/vehicle-policy-state.enum';
import { HOUSE_INCIDENTS_POLICY_STATE_ENUM } from '../../../../data-access/enums/house-incidents-policy-state.enum';
import { VEHICLE_BODY_POLICY_STATE_ENUM } from '../../../../data-access/enums/vehicle-body-policy-state.enum';

export type  PolicyCardTypeModel =
  EQUIPMENT_POLICY_STATE_ENUM |
  VEHICLE_POLICY_STATE_ENUM |
  HOUSE_INCIDENTS_POLICY_STATE_ENUM |
  VEHICLE_BODY_POLICY_STATE_ENUM;
