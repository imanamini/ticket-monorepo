import { inject, Injectable } from '@angular/core';
import { ListOptionEnum } from '../../../../data-access/enums/list-option.enum';
import { Observable } from 'rxjs';
import { PolicyProductCardModel } from '../../../../data-access/models/policy-product-card.model';
import { VEHICLE_POLICY_STATE_ENUM } from '../../../../data-access/enums/vehicle-policy-state.enum';
import { VEHICLE_BODY_POLICY_STATE_ENUM } from '../../../../data-access/enums/vehicle-body-policy-state.enum';
import { EQUIPMENT_POLICY_STATE_ENUM } from '../../../../data-access/enums/equipment-policy-state.enum';
import { HOUSE_INCIDENTS_POLICY_STATE_ENUM } from '../../../../data-access/enums/house-incidents-policy-state.enum';
import { PolicySortEnum } from '../enums/policy-sort.enum';
import { PolicyListThirdPartyDataService } from './policy-list-third-party-data.service';
import { PolicyListBodyDataService } from './policy-list-body-data.service';
import { PolicyListEquipmentDataService } from './policy-list-equipment-data.service';
import { PolicyListHouseIncidentDataService } from './policy-list-house-incident-data.service';
import { InsDigikalaService } from '../../../../../../data-access/services/ins-digikala.service';

@Injectable({
  providedIn: 'root',
})
export class PolicyListDataService {
  private digikalaService = inject(InsDigikalaService);
  private policyListThirdPartyDataService = inject(PolicyListThirdPartyDataService);
  private policyListBodyDataService = inject(PolicyListBodyDataService);
  private policyListEquipmentDataService = inject(PolicyListEquipmentDataService);
  private houseIncidentDataService = inject(PolicyListHouseIncidentDataService);

  getThirdPartyPolicyList(
    type: ListOptionEnum,
    sort: PolicySortEnum,
  ): Observable<PolicyProductCardModel<VEHICLE_POLICY_STATE_ENUM | VEHICLE_BODY_POLICY_STATE_ENUM>[]> {
    if (type === ListOptionEnum.RENEWAL) {
      return new Observable((observer) => observer.next([]));
    }
    return this.policyListThirdPartyDataService.getThirdPartyPolicyList(type, sort);
  }

  getThirdPartyMotorPolicyList(
    type: ListOptionEnum,
    sort: PolicySortEnum,
  ): Observable<PolicyProductCardModel<VEHICLE_POLICY_STATE_ENUM | VEHICLE_BODY_POLICY_STATE_ENUM>[]> {
    if (type === ListOptionEnum.RENEWAL) {
      return new Observable((observer) => observer.next([]));
    }
    return this.policyListThirdPartyDataService.getMotorPolicyList(type, sort);
  }

  getEquipmentPolicyList(type: ListOptionEnum, sort: PolicySortEnum): Observable<PolicyProductCardModel<EQUIPMENT_POLICY_STATE_ENUM>[]> {
    if (this.digikalaService.isDigikala && type === ListOptionEnum.RENEWAL) {
      return new Observable((observer) => observer.next([]));
    }
    return this.policyListEquipmentDataService.getEquipmentPolicyList(type, sort);
  }

  getHouseIncidentPolicyList(
    type: ListOptionEnum,
    sort: PolicySortEnum,
  ): Observable<PolicyProductCardModel<VEHICLE_POLICY_STATE_ENUM | VEHICLE_BODY_POLICY_STATE_ENUM | HOUSE_INCIDENTS_POLICY_STATE_ENUM>[]> {
    if (!this.doesHouseIncidentListApiNeedsToCalled(type)) {
      return new Observable((observer) => observer.next([]));
    }
    return this.houseIncidentDataService.getHouseIncidentPolicyList(type, sort);
  }

  doesHouseIncidentListApiNeedsToCalled(type: ListOptionEnum): boolean {
    return type !== ListOptionEnum.RENEWAL;
  }

  getCarBodyPolicyList(
    type: ListOptionEnum,
    sort: PolicySortEnum,
  ): Observable<PolicyProductCardModel<VEHICLE_POLICY_STATE_ENUM | VEHICLE_BODY_POLICY_STATE_ENUM>[]> {
    if (!this.doesCarBodyListApiNeedsToCalled(type)) {
      return new Observable((observer) => observer.next([]));
    }
    return this.policyListBodyDataService.getCarBodyPolicyList(type, sort);
  }

  private doesCarBodyListApiNeedsToCalled(type: ListOptionEnum): boolean {
    return type !== ListOptionEnum.RENEWAL;
  }
}
