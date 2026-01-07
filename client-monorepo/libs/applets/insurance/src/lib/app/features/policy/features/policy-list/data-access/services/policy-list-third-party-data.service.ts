import { inject, Injectable } from '@angular/core';
import { ListOptionEnum } from '../../../../data-access/enums/list-option.enum';
import { PolicySortEnum } from '../enums/policy-sort.enum';
import { Observable, zipWith } from 'rxjs';
import { PolicyProductCardModel } from '../../../../data-access/models/policy-product-card.model';
import { VEHICLE_POLICY_STATE_ENUM } from '../../../../data-access/enums/vehicle-policy-state.enum';
import { THIRD_PARTY_TYPE_STATE_MAP } from '../constants/third-party-type-state-mapper.constant';
import { map } from 'rxjs/operators';
import {
  VehiclePolicyModel
} from '../../../../../vehicle/data-access/models/third-party/policy/vehicle-policy-result.model';
import { TitleValueContentDataModel } from '../../../../../../data-access/models/title-value-content-data.model';
import { SeparateThousandsPipe } from '@digipay/ng-lib-pipes';
import moment from 'jalali-moment';
import { PlateUtils } from '../../../../../vehicle/util/plate';
import { InsuranceTabEnum } from '../../../../data-access/enums/policy-list.enum';
import { getBodyBadgeStatus, getVehicleBadgeStatus } from '../../../../../../util/policy.utils';
import { BadgeStatusEnum } from '../../../../../../data-access/enums/badge-status.enum';
import {
  PolicyApiService as VehiclePolicyApiService
} from '../../../../../vehicle/data-access/services/third-party/policy-api.service';
import { InsuranceProductTypeEnum } from '../../../../../../data-access/enums/Insurance-product-type.enum';
import { VEHICLE_BODY_POLICY_STATE_ENUM } from '../../../../data-access/enums/vehicle-body-policy-state.enum';
import { BIMEH_THIRD_PARTY_TYPE_STATE_MAP } from '../constants/bimeh-third-party-type-state-mapper.constant';
import {
  MotorPolicyResultModel
} from '../../../../../vehicle/features/third-party-motor/data-access/models/motor-policy-result-model';
import { LandingProviderEnum } from '../../../../../../data-access/enums/landing-provider.enum';

@Injectable({
  providedIn: 'root'
})
export class PolicyListThirdPartyDataService {
  private thirdPartyApiService = inject(VehiclePolicyApiService);

  getThirdPartyPolicyList(type: ListOptionEnum, sort: PolicySortEnum):
    Observable<PolicyProductCardModel<VEHICLE_POLICY_STATE_ENUM | VEHICLE_BODY_POLICY_STATE_ENUM>[]> {
    return this.getInternalThirdPartyPolicyList(type, sort).pipe(
      zipWith(this.getBimehThirdPartyPolicyList(type, sort)),
      map(([internalList, bimehList]) => {
        return [...internalList, ...bimehList].sort((a, b) => b.additional.createAt - a.additional.createAt);
      }));
  }

  getMotorPolicyList(type: ListOptionEnum, sort: PolicySortEnum):
    Observable<PolicyProductCardModel<VEHICLE_POLICY_STATE_ENUM | VEHICLE_BODY_POLICY_STATE_ENUM>[]> {
    return this.thirdPartyApiService.getMotorPolicyList({
      orders: [{
        field: 'trackingCode',
        order: sort ?? PolicySortEnum.DESC,
      }],
      restrictions: [{
        type: 'collection',
        field: 'state',
        values: THIRD_PARTY_TYPE_STATE_MAP[type]
      }]
    }).pipe(map(response => response.result.data.map(item => this.makeMotorCard(item))));
  }

  private getInternalThirdPartyPolicyList(type: ListOptionEnum, sort: PolicySortEnum):
    Observable<PolicyProductCardModel<VEHICLE_POLICY_STATE_ENUM>[]> {
    return this.thirdPartyApiService.getPolicyList({
      orders: [{
        field: 'trackingCode',
        order: sort ?? PolicySortEnum.DESC,
      }],
      restrictions: [
        {
          type: 'collection',
          field: 'state',
          values: THIRD_PARTY_TYPE_STATE_MAP[type]
        }
      ]
    }).pipe(
      map(response => {
        return response.result.data.map(item => this.makeCarDigipayCard(item));
      }));
  }

  private getBimehThirdPartyPolicyList(type: ListOptionEnum, sort: PolicySortEnum):
    Observable<PolicyProductCardModel<VEHICLE_POLICY_STATE_ENUM | VEHICLE_BODY_POLICY_STATE_ENUM>[]> {
    return this.thirdPartyApiService.getPolicyList({
      orders: [],
      restrictions: []
    }, InsuranceProductTypeEnum.Body).pipe(
      map(response =>
        response.result.data
          .filter(item =>
            BIMEH_THIRD_PARTY_TYPE_STATE_MAP[type].includes(item.states.stateTitle.toLowerCase() as VEHICLE_BODY_POLICY_STATE_ENUM) &&
            item.insuranceProductType === InsuranceProductTypeEnum.ThirdParty)
          .map(item => this.makeCarBimehCard(item))));
  }

  private makeCarDigipayCard(card: VehiclePolicyModel): PolicyProductCardModel<VEHICLE_POLICY_STATE_ENUM> {
    const detail: TitleValueContentDataModel[] = [];
    const cardState = card.states.displayState;
    detail.push({
      type: 'text',
      title: 'شماره سفارش',
      value: card.trackingCode
    });
    if (cardState === VEHICLE_POLICY_STATE_ENUM.PRICE_CONFLICT_RESOLVE_PENDING && card.priceConflictAmount) {
      detail.push({
        type: 'text',
        title: 'مبلغ مابه‌التفاوت',
        value: card.priceConflictAmount ? new SeparateThousandsPipe().transform(Number(card.priceConflictAmount ?? 0) / 10) + ' تومان' : '-'
      });
    }
    if (cardState === VEHICLE_POLICY_STATE_ENUM.ISSUING ||
      cardState === VEHICLE_POLICY_STATE_ENUM.PENDING_INFORMATION ||
      cardState === VEHICLE_POLICY_STATE_ENUM.WAITING_FOR_ADDRESS_REGISTRATION) {
      detail.push({
        type: 'text',
        title: 'تاریخ پرداخت',
        value: moment(card.paidAt).locale('fa').format('YYYY/MM/DD')
      });
    }
    if (card.license && cardState === VEHICLE_POLICY_STATE_ENUM.PENDING_PAYMENT) {
      detail.push({
        type: 'plate',
        title: 'پلاک',
        value: PlateUtils.convertCarToText(card.license),
      });
    }

    if (cardState === VEHICLE_POLICY_STATE_ENUM.ISSUED) {
      detail.push({
        type: 'text',
        title: 'معتبر تا تاریخ',
        value: card.expiresAt ? moment(card.expiresAt).locale('fa').format('YYYY/MM/DD') : '-'
      });
    }
    const showBadge: boolean = cardState === VEHICLE_POLICY_STATE_ENUM.PENDING_INFORMATION;
    return {
      id: card.uniqueCode,
      productName: 'بیمه شخص ثالث',
      subtitle: card.vehicleInfo?.fullName,
      type: InsuranceTabEnum.THIRD_PARTY,
      state: cardState as VEHICLE_POLICY_STATE_ENUM,
      topBadge: {
        text: card.states.displayStateTitle,
        status: getVehicleBadgeStatus(cardState as VEHICLE_POLICY_STATE_ENUM),
      },
      bottomBadge: showBadge ? {
        status: BadgeStatusEnum.Warning,
        text: `${this.makeExpirationCountDown(card.completeJourneyDeadline)}`
      } : null,
      insuranceServiceProvider: LandingProviderEnum.Digipay,
      expireTime: card.completeJourneyDeadline || card.expiresAt,
      detail,
      additional: card
    };
  }

  private makeCarBimehCard(card: VehiclePolicyModel): PolicyProductCardModel<VEHICLE_POLICY_STATE_ENUM | VEHICLE_BODY_POLICY_STATE_ENUM> {
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
      type: InsuranceTabEnum.THIRD_PARTY,
      productName: 'بیمه شخص ثالث',
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
      insuranceServiceProvider: LandingProviderEnum.Bimeh,
      expireTime: card.completeJourneyDeadline || card.expiresAt,
      detail,
      additional: card
    };
  }

  private makeMotorCard(card: MotorPolicyResultModel):
    PolicyProductCardModel<VEHICLE_POLICY_STATE_ENUM | VEHICLE_BODY_POLICY_STATE_ENUM> {
    const detail: TitleValueContentDataModel[] = [];
    const cardState = card.states.displayState;
    detail.push({
      type: 'text',
      title: 'شماره سفارش',
      value: card.trackingCode
    });

    if (cardState === VEHICLE_POLICY_STATE_ENUM.PRICE_CONFLICT_RESOLVE_PENDING && card.priceConflictAmount) {
      detail.push({
        type: 'text',
        title: 'مبلغ مابه‌التفاوت',
        value: card.priceConflictAmount ? new SeparateThousandsPipe().transform(Number(card.priceConflictAmount ?? 0) / 10) + ' تومان' : '-'
      });
    }

    if (cardState === VEHICLE_POLICY_STATE_ENUM.ISSUING ||
      cardState === VEHICLE_POLICY_STATE_ENUM.PENDING_INFORMATION ||
      cardState === VEHICLE_POLICY_STATE_ENUM.WAITING_FOR_ADDRESS_REGISTRATION) {
      detail.push({
        type: 'text',
        title: 'تاریخ پرداخت',
        value: moment(card.paidAt).locale('fa').format('YYYY/MM/DD')
      });
    }

    if (card.license && cardState === VEHICLE_POLICY_STATE_ENUM.PENDING_PAYMENT) {
      detail.push({
        type: 'plate',
        title: 'پلاک',
        value: PlateUtils.convertCarToText(card.license),
      });
    }

    if (cardState === VEHICLE_POLICY_STATE_ENUM.ISSUED) {
      detail.push({
        type: 'text',
        title: 'معتبر تا تاریخ',
        value: card.expiresAt ? moment(card.expiresAt).locale('fa').format('YYYY/MM/DD') : '-'
      });
    }
    const showBadge: boolean = cardState === VEHICLE_POLICY_STATE_ENUM.PENDING_INFORMATION;
    return {
      id: card.uniqueCode,
      productName: 'بیمه موتور',
      subtitle: card.vehicleInfo?.type,
      type: InsuranceTabEnum.THIRD_PARTY_MOTOR,
      state: cardState,
      topBadge: {
        text: card.states.displayStateTitle,
        status: getVehicleBadgeStatus(cardState as VEHICLE_POLICY_STATE_ENUM),
      },
      bottomBadge: showBadge ? {
        status: BadgeStatusEnum.Warning,
        text: `${this.makeExpirationCountDown(card.completeJourneyDeadline)}`
      } : null,
      expireTime: card.completeJourneyDeadline || card.expiresAt,
      detail,
      insuranceServiceProvider: LandingProviderEnum.Digipay,
    };
  }

  private makeExpirationCountDown(journeyDeadline: number): number {
    return (journeyDeadline - new Date().getTime()) / 1000;
  }
}
