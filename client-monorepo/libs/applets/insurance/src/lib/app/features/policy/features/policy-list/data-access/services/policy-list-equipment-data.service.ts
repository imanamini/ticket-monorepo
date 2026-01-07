import { inject, Injectable } from '@angular/core';
import { RenewalModel } from '../../../../../equipment/api/models/policy/policy-renewal.model';
import { PolicyProductCardModel } from '../../../../data-access/models/policy-product-card.model';
import {
  EQUIPMENT_POLICY_STATE_ENUM,
  EQUIPMENT_POLICY_STATE_ENUM_TRANSLATION,
} from '../../../../data-access/enums/equipment-policy-state.enum';
import { TitleValueContentDataModel } from '../../../../../../data-access/models/title-value-content-data.model';
import { InsuranceTabEnum } from '../../../../data-access/enums/policy-list.enum';
import { BadgeStatusEnum } from '../../../../../../data-access/enums/badge-status.enum';
import { PolicyModel } from '../../../../../equipment/api/models/policy/policy.model';
import moment from 'jalali-moment';
import { getEquipmentBadgeStatus } from '../../../../../../util/policy.utils';
import { ListOptionEnum } from '../../../../data-access/enums/list-option.enum';
import { PolicySortEnum } from '../enums/policy-sort.enum';
import { map, Observable } from 'rxjs';
import { OrderAndFilterParametersModel } from '../../../../../../data-access/models/order-and-filter-parameters.model';
import { PolicyApiService as EquipmentPolicyApiService } from '../../../../../../data-access/services/policy/policy-api.service';
import { LandingProviderEnum } from '../../../../../../data-access/enums/landing-provider.enum';
import { InsDigikalaService } from '../../../../../../data-access/services/ins-digikala.service';

@Injectable({
  providedIn: 'root',
})
export class PolicyListEquipmentDataService {
  private equipmentPolicyApiService = inject(EquipmentPolicyApiService);
  private digikalaService = inject(InsDigikalaService);

  getEquipmentPolicyList(type: ListOptionEnum, sort: PolicySortEnum): Observable<PolicyProductCardModel<EQUIPMENT_POLICY_STATE_ENUM>[]> {
    const orderAndFilters: OrderAndFilterParametersModel = {
      orders: [{ field: 'policydraftno', order: sort ?? PolicySortEnum.DESC }],
      restrictions: [],
    };

    switch (type) {
      case ListOptionEnum.PURCHASED:
        return this.equipmentPolicyApiService
          .getPolicyListNew(orderAndFilters)
          .pipe(
            map((item) =>
              item.data.filter((card) => this.canShowEquipmentCardInDigikala(card)).map((card) => this.makeEquipmentPurchasedCard(card)),
            ),
          );
      case ListOptionEnum.RENEWAL:
        return this.equipmentPolicyApiService
          .getRenewalListProfile(orderAndFilters)
          .pipe(map((item) => item.data.filter((card) => card.daysLeft >= 0).map((card) => this.makeEquipmentRenewalCard(card))));
      case ListOptionEnum.UNCOMPLETE:
        return new Observable((observer) => observer.next([]));
    }
  }

  canShowEquipmentCardInDigikala(card: PolicyModel): boolean {
    return this.digikalaService.isDigikala
      ? card.policyStatus.identifier === EQUIPMENT_POLICY_STATE_ENUM.ACTIVE ||
          card.policyStatus.identifier === EQUIPMENT_POLICY_STATE_ENUM.EffectiveActive
      : true;
  }

  private makeEquipmentRenewalCard(card: RenewalModel): PolicyProductCardModel<EQUIPMENT_POLICY_STATE_ENUM> {
    const detail: TitleValueContentDataModel[] = [];
    detail.push({
      type: 'text',
      title: 'شماره بیمه‌نامه',
      value: card.policyNumber,
    });
    return {
      id: card.orderId,
      productName: 'تجهیزات الکترونیک',
      subtitle: `${card.productBrand} ${card.productModel}`,
      category: card.productCategory,
      brand: card.productBrand,
      model: card.productModel,
      policyDraftNo: card.oldPolicyNumber,
      expiresAt: card.expiresAtPersian,
      identifier: new Date(card.expiresAt) >= new Date() ? EQUIPMENT_POLICY_STATE_ENUM.Renewal : EQUIPMENT_POLICY_STATE_ENUM.NewForRenewal,
      link: card.link,
      additional: {
        uniqueCode: card.uniqueCode,
        hasClaim: card.hasClaim,
        policyDraftNo: card.oldPolicyNumber,
      },
      type: InsuranceTabEnum.DIGITAL_EQUIPMENT,
      state: EQUIPMENT_POLICY_STATE_ENUM.Renewal,
      topBadge: {
        text: EQUIPMENT_POLICY_STATE_ENUM_TRANSLATION[EQUIPMENT_POLICY_STATE_ENUM.Renewal],
        status: BadgeStatusEnum.Info,
      },
      detail,
      insuranceServiceProvider: LandingProviderEnum.Digipay,
    } as PolicyProductCardModel<EQUIPMENT_POLICY_STATE_ENUM>;
  }

  private makeEquipmentPurchasedCard(card: PolicyModel): PolicyProductCardModel<EQUIPMENT_POLICY_STATE_ENUM> {
    const detail: TitleValueContentDataModel[] = [];
    const cardState = card.policyStatus.identifier;
    detail.push({
      type: 'text',
      title: 'شماره سفارش',
      value: card.policyDraftNo,
    });
    if (cardState === EQUIPMENT_POLICY_STATE_ENUM.PENDING || cardState === EQUIPMENT_POLICY_STATE_ENUM.PAID_POLICY_PENDING) {
      detail.push({
        type: 'text',
        title: 'ارزش دستگاه',
        value: card.electronicEquipment.price,
      });
    }
    if (cardState === EQUIPMENT_POLICY_STATE_ENUM.PENDING || cardState === EQUIPMENT_POLICY_STATE_ENUM.PAID_POLICY_PENDING) {
      detail.push({
        type: 'text',
        title: 'شماره بیمه‌نامه',
        value: card.endAt,
      });
    }
    if (
      cardState === EQUIPMENT_POLICY_STATE_ENUM.ACTIVE ||
      cardState === EQUIPMENT_POLICY_STATE_ENUM.EffectiveActive ||
      cardState === EQUIPMENT_POLICY_STATE_ENUM.Terminated
    ) {
      detail.push({
        type: 'text',
        title: 'معتبر تا تاریخ',
        value: moment(card.expiresAt).locale('fa').format('YYYY/MM/DD'),
      });
    }
    const deadline: number = cardState === EQUIPMENT_POLICY_STATE_ENUM.PAID_POLICY_PENDING ? +card.paidAt + 3 * 24 * 60 * 60 * 1000 : null;
    return {
      id: card.policyId,
      productName: 'تجهیزات الکترونیک',
      subtitle: `${card.electronicEquipment.brand} ${card.electronicEquipment.model}`,
      category: card.electronicEquipment.category,
      brand: card.electronicEquipment.brand,
      model: card.electronicEquipment.model,
      policyDraftNo: card.policyDraftNo,
      expiresAt: moment(card.expiresAt).format('jYYYY/jMM/jDD'),
      identifier: cardState,
      uniqueCode: card.urlKey,
      type: InsuranceTabEnum.DIGITAL_EQUIPMENT,
      state: card.policyStatus.identifier,
      electronicEquipment: card.electronicEquipment,
      detail,
      insuranceServiceProvider: LandingProviderEnum.Digipay,
      bottomBadge: deadline
        ? {
            status: BadgeStatusEnum.Warning,
            text: `${this.makeExpirationCountDown(deadline)}`,
          }
        : null,
      topBadge: {
        text: card.policyStatus.title,
        status: getEquipmentBadgeStatus(card.policyStatus.identifier),
      },
      additional: {
        policyDraftNo: card.policyDraftNo,
        uniqueCode: card.urlKey,
        hasClaim: card.hasClaim,
        downloadLink: card.premiumUrl,
        saleChannel: card.saleChannel,
      },
    } as PolicyProductCardModel<EQUIPMENT_POLICY_STATE_ENUM>;
  }

  private makeExpirationCountDown(journeyDeadline: number): number {
    return (journeyDeadline - new Date().getTime()) / 1000;
  }
}
