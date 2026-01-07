import { inject, Injectable } from '@angular/core';
import { PolicyDetailService } from './policy-detail.service';
import { PolicyApiService } from '../../../../../../data-access/services/policy/policy-api.service';
import { SectionDetailItemModel } from '../../../../../../data-access/models/section-detail-item.model';
import moment from 'jalali-moment';
import { PolicyModel } from '../../../../../equipment/api/models/policy/policy.model';
import { getEquipmentBadgeStatus } from '../../../../../../util/policy.utils';
import { BottomSheetService } from '../../../../../../data-access/services/bottom-sheet.service';
import { EquipmentDetailsBottomSheetComponent } from '../../components/equipment-details-bottom-sheet/equipment-details-bottom-sheet.component';
import { EQUIPMENT_POLICY_STATE_ENUM } from '../../../../data-access/enums/equipment-policy-state.enum';
import { InsuranceUrlsEnum } from '../../../../../../data-access/enums/insurance-urls.enum';
import { EquipmentActivateBundleBottomSheetComponent } from '../../components/equipment-activate-bundle-bottom-sheet/equipment-activate-bundle-bottom-sheet.component';
import { SaleChannelEnum } from '../../../../../equipment/shared-steps/models/sales-channel.enum';
import { SectionCardModel } from '../../../../../../data-access/models/section-card.model';
import { INSURANCE_APP_PREFIX } from '../../../../../../data-access/constants/insurance-app-prefix.constant';

@Injectable({
  providedIn: 'root',
})
export class PolicyDetailEquipmentService extends PolicyDetailService {
  private equipmentPolicyApiService = inject(PolicyApiService);
  private bottomSheetService = inject(BottomSheetService);
  private data: PolicyModel;

  getPolicyDetail(id: string): Promise<SectionCardModel[]> {
    return new Promise((resolve, reject) => {
      const filterEntry = {
        order: [],
        restrictions: [
          {
            type: 'simple',
            field: 'PolicyNumber',
            value: id,
            operation: 'eq',
          },
        ],
      };
      this.equipmentPolicyApiService.getPolicyList(filterEntry).subscribe({
        next: (value) => {
          this.data = value.data[0];
          resolve(this.createPolicyDetails(this.data));
        },
      });
    });
  }

  showMajorActionButton(): boolean {
    const state = this.data.policyStatus.identifier;
    switch (state) {
      case EQUIPMENT_POLICY_STATE_ENUM.ACTIVE:
      case EQUIPMENT_POLICY_STATE_ENUM.EffectiveActive:
      case EQUIPMENT_POLICY_STATE_ENUM.Terminated:
      case EQUIPMENT_POLICY_STATE_ENUM.Expired:
      case EQUIPMENT_POLICY_STATE_ENUM.PENDING:
      case EQUIPMENT_POLICY_STATE_ENUM.PAID_POLICY_PENDING:
      case EQUIPMENT_POLICY_STATE_ENUM.SubscriptionOffline:
      case EQUIPMENT_POLICY_STATE_ENUM.PAID_POLICY:
        return true;
      default:
        return false;
    }
  }

  getMajorActionButtonText(): string {
    switch (this.data.policyStatus.identifier) {
      case EQUIPMENT_POLICY_STATE_ENUM.Terminated:
      case EQUIPMENT_POLICY_STATE_ENUM.Expired:
        return 'خرید بیمه‌نامه جدید';
      case EQUIPMENT_POLICY_STATE_ENUM.EffectiveActive:
      case EQUIPMENT_POLICY_STATE_ENUM.ACTIVE:
        return 'دانلود بیمه‌نامه';
      case EQUIPMENT_POLICY_STATE_ENUM.PENDING:
      case EQUIPMENT_POLICY_STATE_ENUM.PAID_POLICY_PENDING:
      case EQUIPMENT_POLICY_STATE_ENUM.SubscriptionOffline:
        return 'ادامه فرایند';
      case EQUIPMENT_POLICY_STATE_ENUM.PAID_POLICY:
        if (this.data.saleChannel === SaleChannelEnum.BUNDLED) {
          return 'فعالسازی بیمه‌نامه';
        }
        return 'ادامه فرایند';
    }
  }

  majorActionButtonHandler(): void {
    switch (this.data.policyStatus.identifier) {
      case EQUIPMENT_POLICY_STATE_ENUM.ACTIVE:
      case EQUIPMENT_POLICY_STATE_ENUM.EffectiveActive:
        window.open(this.data.premiumUrl, '_blank');
        break;
      case EQUIPMENT_POLICY_STATE_ENUM.Terminated:
      case EQUIPMENT_POLICY_STATE_ENUM.Expired:
        this.router.navigate([`${INSURANCE_APP_PREFIX}/${InsuranceUrlsEnum.Equipment}`]);
        break;
      case EQUIPMENT_POLICY_STATE_ENUM.PAID_POLICY:
        if (this.data.saleChannel === SaleChannelEnum.BUNDLED) {
          this.bottomSheetService
            .open(EquipmentActivateBundleBottomSheetComponent, {
              name: 'EquipmentActivateBundleBottomSheetComponent',
              data: this.data,
            })
            .afterDismissed()
            .subscribe((res) => {
              if (!res) {
                return;
              }
              window.location.reload();
            });
        } else {
          this.router.navigate([`${INSURANCE_APP_PREFIX}/${InsuranceUrlsEnum.Equipment}`], { queryParams: { code: this.data?.urlKey } });
        }
        break;
      case EQUIPMENT_POLICY_STATE_ENUM.PENDING:
      case EQUIPMENT_POLICY_STATE_ENUM.PAID_POLICY_PENDING:
        this.router.navigate([`${INSURANCE_APP_PREFIX}/${InsuranceUrlsEnum.Equipment}`], { queryParams: { code: this.data?.urlKey } });
        break;
      case EQUIPMENT_POLICY_STATE_ENUM.SubscriptionOffline:
        this.router.navigate([`${INSURANCE_APP_PREFIX}/${InsuranceUrlsEnum.Subscription}`], { queryParams: { code: this.data?.urlKey } });
    }
  }

  hasMoreActions(): boolean {
    return (
      this.data.policyStatus.identifier === EQUIPMENT_POLICY_STATE_ENUM.ACTIVE ||
      this.data.policyStatus.identifier === EQUIPMENT_POLICY_STATE_ENUM.EffectiveActive
    );
  }

  moreActionsHandler(): void {
    this.bottomSheetService.open(EquipmentDetailsBottomSheetComponent, {
      name: 'EquipmentDetailsBottomSheetComponent',
      data: this.data,
    });
  }

  hasPriceConflict(): boolean {
    return false;
  }

  createPolicyDetails(data: PolicyModel): SectionCardModel[] {
    const details: SectionCardModel[] = [];
    const cardDetails: SectionDetailItemModel[] = [
      {
        type: 'text',
        title: 'شماره بیمه‌نامه',
        value: data?.policyDraftNo,
      },
      {
        type: 'text',
        title: 'ارزش کالا',
        value: this.transformPrice(data.electronicEquipment.price),
      },
      {
        type: 'text',
        title: 'تاریخ شروع',
        value: moment(data.startAt).locale('fa').format('HH:mm - YYYY/MM/DD'),
      },
      {
        type: 'text',
        title: 'پایان اعتبار',
        value: moment(data.endAt).locale('fa').format('HH:mm - YYYY/MM/DD'),
      },
    ];
    const remainingDays = Math.floor((+data.endAt - moment().valueOf()) / (24 * 60 * 60 * 1000));
    if (remainingDays >= 0) {
      cardDetails.push({
        type: 'text',
        title: 'زمان باقی‌مانده',
        value: remainingDays + ' روز',
      });
    }
    details.push({
      title: 'اطلاعات بیمه‌نامه',
      card: {
        title: data.electronicEquipment.brand + ' ' + data.electronicEquipment.model,
        subtitle: data.policyType.title,
        expanded: true,
        expandable: true,
        badge: data.policyStatus.title,
        badgeStatus: getEquipmentBadgeStatus(data.policyStatus.identifier),
        details: cardDetails,
      },
    });
    const paymentDetails: SectionDetailItemModel[] = [
      {
        type: 'text',
        title: 'حق بیمه اولیه',
        value: this.transformPrice(data?.policyAmount?.netAmount),
      },
      {
        type: 'text',
        title: 'ارزش افزوده',
        value: this.transformPrice(data?.policyAmount?.taxAmount),
      },
      {
        type: 'text',
        title: 'مجموع تخفیفات',
        value: this.transformPrice(data?.policyAmount?.discountAmount),
        class: 'text-oninvert-error',
      },
      {
        type: 'text',
        title: 'مبلغ پرداخت شده',
        value: this.transformPrice(data?.policyAmount?.paidAmount),
      },
    ];
    details.push({
      title: 'اطلاعات پرداخت',
      card: {
        title: 'جزییات',
        subtitle: moment(data.paidAt).locale('fa').format('HH:mm - YYYY/MM/DD'),
        expanded: true,
        expandable: true,
        details: paymentDetails,
      },
    });
    return details;
  }

  showMinorActionButton(): boolean {
    return (
      this.data.policyStatus.identifier === EQUIPMENT_POLICY_STATE_ENUM.ACTIVE ||
      this.data.policyStatus.identifier === EQUIPMENT_POLICY_STATE_ENUM.EffectiveActive
    );
  }

  getMinorActionButtonText(): string {
    return 'ثبت خسارت';
  }

  minorActionButtonHandler(): void {
    this.router.navigate([`${INSURANCE_APP_PREFIX}/claim/register/type`]);
  }
}
