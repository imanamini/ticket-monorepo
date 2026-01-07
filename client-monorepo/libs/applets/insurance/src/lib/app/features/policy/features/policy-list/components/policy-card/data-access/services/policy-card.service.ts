import { PolicyProductCardModel } from '../../../../../../data-access/models/policy-product-card.model';
import { EQUIPMENT_POLICY_STATE_ENUM } from '../../../../../../data-access/enums/equipment-policy-state.enum';
import { VEHICLE_POLICY_STATE_ENUM } from '../../../../../../data-access/enums/vehicle-policy-state.enum';
import {
  HOUSE_INCIDENTS_POLICY_STATE_ENUM
} from '../../../../../../data-access/enums/house-incidents-policy-state.enum';
import { VEHICLE_BODY_POLICY_STATE_ENUM } from '../../../../../../data-access/enums/vehicle-body-policy-state.enum';
import { Injectable } from '@angular/core';
import { PolicyCardTypeModel } from '../../../../data-access/models/policy-card-type.model';

@Injectable({
  providedIn: 'root'
})
export abstract class PolicyCardService {

  abstract handleButtonClicked(data: PolicyProductCardModel<PolicyCardTypeModel>): Promise<boolean>;

  abstract handleDetailButtonClicked(data: PolicyProductCardModel<PolicyCardTypeModel>): void;

  abstract getActionButtonText(data: PolicyProductCardModel<PolicyCardTypeModel>): string;

  abstract getDetailButtonText(data: PolicyProductCardModel<PolicyCardTypeModel>): string;

  abstract showActionButton(data: PolicyProductCardModel<PolicyCardTypeModel>): boolean;

  abstract showDetailButton(data: PolicyProductCardModel<PolicyCardTypeModel>): boolean;

  abstract getActionButtonRightIcon(data: PolicyProductCardModel<PolicyCardTypeModel>): {
    name: string;
    type: string
  } | null ;

  abstract isActionButtonBrand(data: PolicyProductCardModel<PolicyCardTypeModel>): boolean;
}
