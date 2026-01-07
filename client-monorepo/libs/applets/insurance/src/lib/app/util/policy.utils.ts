import { BadgeStatusEnum } from '../data-access/enums/badge-status.enum';
import { EQUIPMENT_POLICY_STATE_ENUM } from '../features/policy/data-access/enums/equipment-policy-state.enum';
import { VEHICLE_POLICY_STATE_ENUM } from '../features/policy/data-access/enums/vehicle-policy-state.enum';
import { VEHICLE_BODY_POLICY_STATE_ENUM } from '../features/policy/data-access/enums/vehicle-body-policy-state.enum';
import { HOUSE_INCIDENTS_POLICY_STATE_ENUM } from '../features/policy/data-access/enums/house-incidents-policy-state.enum';

export const getVehicleBadgeStatus = (state: VEHICLE_POLICY_STATE_ENUM): BadgeStatusEnum => {
  switch (state) {
    case VEHICLE_POLICY_STATE_ENUM.PENDING_INFORMATION:
    case VEHICLE_POLICY_STATE_ENUM.EXPIRING:
    case VEHICLE_POLICY_STATE_ENUM.WAITING_FOR_ADDRESS_REGISTRATION:
      return BadgeStatusEnum.Warning;
    case VEHICLE_POLICY_STATE_ENUM.ISSUED:
      return BadgeStatusEnum.Success;
    case VEHICLE_POLICY_STATE_ENUM.REFUSED:
    case VEHICLE_POLICY_STATE_ENUM.CANCELLED:
      return BadgeStatusEnum.Error;
    case VEHICLE_POLICY_STATE_ENUM.EXPIRED:
      return BadgeStatusEnum.Neutral;
    case VEHICLE_POLICY_STATE_ENUM.PRICE_CONFLICT_RESOLVE_PENDING:
    case VEHICLE_POLICY_STATE_ENUM.DOCUMENTS_CONFLICT_RESOLVE_PENDING:
      return BadgeStatusEnum.Warning;
    default:
      return BadgeStatusEnum.Info;
  }
};

export const getEquipmentBadgeStatus = (state: EQUIPMENT_POLICY_STATE_ENUM): BadgeStatusEnum => {
  switch (state) {
    case EQUIPMENT_POLICY_STATE_ENUM.Broken:
    case EQUIPMENT_POLICY_STATE_ENUM.PENDING:
      return BadgeStatusEnum.Warning;
    case EQUIPMENT_POLICY_STATE_ENUM.ACTIVE:
    case EQUIPMENT_POLICY_STATE_ENUM.EffectiveActive:
      return BadgeStatusEnum.Success;
    case EQUIPMENT_POLICY_STATE_ENUM.CANCELLED:
      return BadgeStatusEnum.Error;
    case EQUIPMENT_POLICY_STATE_ENUM.Expired:
      return BadgeStatusEnum.Neutral;
    case EQUIPMENT_POLICY_STATE_ENUM.PAID_POLICY:
    default:
      return BadgeStatusEnum.Info;
  }
};

export const getBodyBadgeStatus = (state: VEHICLE_BODY_POLICY_STATE_ENUM): BadgeStatusEnum => {
  switch (state) {
    case VEHICLE_BODY_POLICY_STATE_ENUM.CANCELED:
      return BadgeStatusEnum.Neutral;
    case VEHICLE_BODY_POLICY_STATE_ENUM.ISSUED:
      return BadgeStatusEnum.Success;
    case VEHICLE_BODY_POLICY_STATE_ENUM.DOCUMENTDEFECT:
    case VEHICLE_BODY_POLICY_STATE_ENUM.DEBTOR:
    case VEHICLE_BODY_POLICY_STATE_ENUM.INQUIRY:
      return BadgeStatusEnum.Warning;
    case VEHICLE_BODY_POLICY_STATE_ENUM.PENDING:
    default:
      return BadgeStatusEnum.Info;
  }
};

export const getHouseIncidentBadgeStatus = (state: string): BadgeStatusEnum => {
  switch (state) {
    case HOUSE_INCIDENTS_POLICY_STATE_ENUM.Paid:
    case HOUSE_INCIDENTS_POLICY_STATE_ENUM.UserInfoCompleted:
      return BadgeStatusEnum.Warning;
    case HOUSE_INCIDENTS_POLICY_STATE_ENUM.Issued:
      return BadgeStatusEnum.Success;
    default:
      return BadgeStatusEnum.Info;
  }
};
