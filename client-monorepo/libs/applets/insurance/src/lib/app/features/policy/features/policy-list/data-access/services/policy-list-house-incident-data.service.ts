import { inject, Injectable } from '@angular/core';
import { ListOptionEnum } from '../../../../data-access/enums/list-option.enum';
import { PolicySortEnum } from '../enums/policy-sort.enum';
import { map, Observable } from 'rxjs';
import { PolicyProductCardModel } from '../../../../data-access/models/policy-product-card.model';
import { VEHICLE_POLICY_STATE_ENUM } from '../../../../data-access/enums/vehicle-policy-state.enum';
import { VEHICLE_BODY_POLICY_STATE_ENUM } from '../../../../data-access/enums/vehicle-body-policy-state.enum';
import { HOUSE_INCIDENTS_POLICY_STATE_ENUM } from '../../../../data-access/enums/house-incidents-policy-state.enum';
import { HOUSE_INCIDENTS_TYPE_STATE_MAP } from '../constants/house-incidents-type-state-map.constant';
import { HouseIncidentPolicyCardModel } from '../../../../../../data-access/models/house-incident-list.model';
import { TitleValueContentDataModel } from '../../../../../../data-access/models/title-value-content-data.model';
import moment from 'jalali-moment';
import { InsuranceTabEnum } from '../../../../data-access/enums/policy-list.enum';
import { getHouseIncidentBadgeStatus } from '../../../../../../util/policy.utils';
import { BadgeStatusEnum } from '../../../../../../data-access/enums/badge-status.enum';
import {
  HouseIncidentsApiService
} from '../../../../../house-incidents/data-access/services/house-incidents-api.service';
import { LandingProviderEnum } from '../../../../../../data-access/enums/landing-provider.enum';

@Injectable({
  providedIn: 'root',
})
export class PolicyListHouseIncidentDataService {
  private houseIncidentsApiService = inject(HouseIncidentsApiService);

  getHouseIncidentPolicyList(type: ListOptionEnum, sort: PolicySortEnum):
    Observable<PolicyProductCardModel<VEHICLE_POLICY_STATE_ENUM | VEHICLE_BODY_POLICY_STATE_ENUM | HOUSE_INCIDENTS_POLICY_STATE_ENUM>[]> {
    if (!this.doesHouseIncidentListApiNeedsToCalled(type)) {
      return new Observable(observer => observer.next([]));
    }
    return this.houseIncidentsApiService.getPolicies({
      orders: [{
        field: 'policyNumber',
        order: sort ?? PolicySortEnum.DESC,
      }],
      restrictions: [{
        type: 'collection',
        field: 'state',
        values: HOUSE_INCIDENTS_TYPE_STATE_MAP[type]
      }]
    }).pipe(
      map(response => response.result.data.map(item => this.makeHouseIncidentCard(item))));
  }

  private makeHouseIncidentCard(card: HouseIncidentPolicyCardModel):
    PolicyProductCardModel<VEHICLE_POLICY_STATE_ENUM | VEHICLE_BODY_POLICY_STATE_ENUM | HOUSE_INCIDENTS_POLICY_STATE_ENUM> {
    const detail: TitleValueContentDataModel[] = [];

    detail.push({
      type: 'text',
      title: card.state === HOUSE_INCIDENTS_POLICY_STATE_ENUM.Issued ? 'شماره بیمه‌نامه' : 'شماره سفارش',
      value: card.trackingCode
    });

    if (card.state === HOUSE_INCIDENTS_POLICY_STATE_ENUM.Paid ||
      card.state === HOUSE_INCIDENTS_POLICY_STATE_ENUM.Issued) {
      detail.push({
        type: 'text',
        title: 'تاریخ پرداخت',
        value: card.price.paidAt ? moment(card.price.paidAt).locale('fa').format('YYYY/MM/DD') : '-'
      });
    }
    const deadline: number = card.state === HOUSE_INCIDENTS_POLICY_STATE_ENUM.Paid ? card.price.paidAt + 3 * 24 * 60 * 60 * 1000 : null;
    return {
      id: card.id,
      productName: 'بیمه خانه',
      subtitle: card.data?.title,
      type: InsuranceTabEnum.HOUSE_INCIDENT,
      state: card?.state,
      cardIcon: 'insurance-assets/vehicle/icons/ins-icon-insurer-logo_Saman.svg',
      topBadge: {
        text: card?.stateTitle,
        status: getHouseIncidentBadgeStatus(card?.state),
      },
      bottomBadge: deadline ? {
        status: BadgeStatusEnum.Warning,
        text: `${this.makeExpirationCountDown(deadline)}`
      } : null,
      expireTime: null,
      insuranceServiceProvider: LandingProviderEnum.Digipay,
      detail
    };
  }

  private doesHouseIncidentListApiNeedsToCalled(type: ListOptionEnum): boolean {
    return type !== ListOptionEnum.RENEWAL;
  }

  private makeExpirationCountDown(journeyDeadline: number): number {
    return (journeyDeadline - new Date().getTime()) / 1000;
  }
}
