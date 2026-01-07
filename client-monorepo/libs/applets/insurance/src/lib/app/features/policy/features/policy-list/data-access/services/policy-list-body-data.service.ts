import { inject, Injectable } from '@angular/core';
import {
  VehiclePolicyModel
} from '../../../../../vehicle/data-access/models/third-party/policy/vehicle-policy-result.model';
import { PolicyProductCardModel } from '../../../../data-access/models/policy-product-card.model';
import { VEHICLE_POLICY_STATE_ENUM } from '../../../../data-access/enums/vehicle-policy-state.enum';
import { VEHICLE_BODY_POLICY_STATE_ENUM } from '../../../../data-access/enums/vehicle-body-policy-state.enum';
import { TitleValueContentDataModel } from '../../../../../../data-access/models/title-value-content-data.model';
import { SeparateThousandsPipe } from '@digipay/ng-lib-pipes';
import moment from 'jalali-moment';
import { InsuranceTabEnum } from '../../../../data-access/enums/policy-list.enum';
import { getBodyBadgeStatus } from '../../../../../../util/policy.utils';
import { BadgeStatusEnum } from '../../../../../../data-access/enums/badge-status.enum';
import { ListOptionEnum } from '../../../../data-access/enums/list-option.enum';
import { PolicySortEnum } from '../enums/policy-sort.enum';
import { map, Observable } from 'rxjs';
import { InsuranceProductTypeEnum } from '../../../../../../data-access/enums/Insurance-product-type.enum';
import { BODY_TYPE_STATE_MAP } from '../constants/body-type-state-mapper.constant';
import {
  PolicyApiService as VehiclePolicyApiService
} from '../../../../../vehicle/data-access/services/third-party/policy-api.service';
import { LandingProviderEnum } from '../../../../../../data-access/enums/landing-provider.enum';

@Injectable({
  providedIn: 'root',
})
export class PolicyListBodyDataService {
  private thirdPartyApiService = inject(VehiclePolicyApiService);

  getCarBodyPolicyList(type: ListOptionEnum, sort: PolicySortEnum):
    Observable<PolicyProductCardModel<VEHICLE_POLICY_STATE_ENUM | VEHICLE_BODY_POLICY_STATE_ENUM>[]> {
    return this.thirdPartyApiService.getPolicyList({
      orders: [{
        field: 'trackingCode',
        order: sort ?? PolicySortEnum.DESC,
      }],
      restrictions: []
    }, InsuranceProductTypeEnum.Body).pipe(
      map(response =>
        response.result.data
          .filter(item => BODY_TYPE_STATE_MAP[type].includes(item.states.stateTitle.toLowerCase() as VEHICLE_BODY_POLICY_STATE_ENUM))
          .map(item => this.makeCarBodyCard(item))));
  }

  private makeCarBodyCard(card: VehiclePolicyModel): PolicyProductCardModel<VEHICLE_POLICY_STATE_ENUM | VEHICLE_BODY_POLICY_STATE_ENUM> {
    const detail: TitleValueContentDataModel[] = [];
    const cardState = card.states.displayState;
    detail.push({
      type: 'text',
      title: 'شماره بیمه‌نامه',
      value: card.trackingCode
    });
    if (cardState === VEHICLE_BODY_POLICY_STATE_ENUM.DEBTOR) {
      detail.push({
        type: 'text',
        title: 'مبلغ مابه‌التفاوت',
        value: card.priceConflictAmount ? new SeparateThousandsPipe().transform(Number(card.priceConflictAmount ?? 0) / 10) + ' تومان' : '-'
      });
    }
    if (cardState === VEHICLE_BODY_POLICY_STATE_ENUM.VISITDOCUMENTDEFECT) {
      detail.push({
        type: 'text',
        title: 'تاریخ بازدید',
        value: '-'
      });
    }
    if (cardState === VEHICLE_BODY_POLICY_STATE_ENUM.PENDING) {
      detail.push({
        type: 'text',
        title: 'تاریخ پرداخت',
        value: card.paidAt ? moment(card.paidAt).locale('fa').format('YYYY/MM/DD') : '-'
      });
    }
    if (cardState === VEHICLE_BODY_POLICY_STATE_ENUM.ISSUED) {
      detail.push({
        type: 'text',
        title: 'معتبر تا تاریخ',
        value: card.expiresAt ? moment(card.expiresAt).locale('fa').format('YYYY/MM/DD') : '-'
      });
    }
    const deadline: number =
      cardState === VEHICLE_BODY_POLICY_STATE_ENUM.PENDING
        ? card.paidAt + 3 * 24 * 60 * 60 * 1000 : null;
    return {
      id: card.uniqueCode,
      type: InsuranceTabEnum.CAR_BODY,
      productName: 'بیمه بدنه',
      subtitle: card.vehicleInfo?.fullName,
      state: card.states.stateTitle.toLowerCase() as VEHICLE_BODY_POLICY_STATE_ENUM,
      topBadge: {
        text: card.states.displayStateTitle,
        status: getBodyBadgeStatus(card.states.displayState as VEHICLE_BODY_POLICY_STATE_ENUM),
      },
      bottomBadge: deadline ? {
        status: BadgeStatusEnum.Warning,
        text: `${this.makeExpirationCountDown(deadline)}`
      } : null,
      expireTime: card.completeJourneyDeadline || card.expiresAt,
      detail,
      additional: card,
      insuranceServiceProvider: LandingProviderEnum.Digipay,
    };
  }

  private makeExpirationCountDown(journeyDeadline: number): number {
    return (journeyDeadline - new Date().getTime()) / 1000;
  }
}
