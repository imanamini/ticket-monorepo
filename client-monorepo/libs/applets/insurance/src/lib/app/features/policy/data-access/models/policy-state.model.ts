import { EQUIPMENT_POLICY_STATE_ENUM } from '../enums/equipment-policy-state.enum';
import { VEHICLE_ORDER_STATE_ENUM } from '../../../../data-access/enums/vehicle-order-state.enum';
import { EQUIPMENT_ORDER_STATE_ENUM } from '../../../../data-access/enums/equipment-order-state.enum';
import { VEHICLE_POLICY_STATE_ENUM } from '../enums/vehicle-policy-state.enum';
import { VEHICLE_BODY_POLICY_STATE_ENUM } from '../enums/vehicle-body-policy-state.enum';

type policyStateType = VEHICLE_POLICY_STATE_ENUM | EQUIPMENT_POLICY_STATE_ENUM | VEHICLE_BODY_POLICY_STATE_ENUM;
type orderStateType = VEHICLE_ORDER_STATE_ENUM | EQUIPMENT_ORDER_STATE_ENUM;

export interface PolicyStateModel<T extends policyStateType, Y extends orderStateType> {
  state: Y;
  stateTitle: string;
  displayState: T;
  displayStateTitle: string;
}
