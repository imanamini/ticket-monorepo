import { TitleValueContentDataModel } from '../../../../data-access/models/title-value-content-data.model';
import { BadgeModel } from '../../../../data-access/models/badge.model';
import { EQUIPMENT_POLICY_STATE_ENUM } from '../enums/equipment-policy-state.enum';
import { VEHICLE_POLICY_STATE_ENUM } from '../enums/vehicle-policy-state.enum';
import { InsuranceTabEnum } from '../enums/policy-list.enum';
import { HOUSE_INCIDENTS_POLICY_STATE_ENUM } from '../enums/house-incidents-policy-state.enum';
import { VEHICLE_BODY_POLICY_STATE_ENUM } from '../enums/vehicle-body-policy-state.enum';
import { LandingProviderEnum } from '../../../../data-access/enums/landing-provider.enum';

type StateEnum = VEHICLE_POLICY_STATE_ENUM |
  EQUIPMENT_POLICY_STATE_ENUM |
  HOUSE_INCIDENTS_POLICY_STATE_ENUM |
  VEHICLE_BODY_POLICY_STATE_ENUM;

export interface PolicyProductCardModel<T extends StateEnum> {
  productName: string;
  subtitle: string;
  id: number | string;
  type: InsuranceTabEnum;
  state: T;
  insuranceServiceProvider: LandingProviderEnum;
  cardIcon?: string;
  topBadge?: BadgeModel;
  bottomBadge?: BadgeModel;
  detail: TitleValueContentDataModel[];
  expireTime?: number;
  additional?: any;
}
