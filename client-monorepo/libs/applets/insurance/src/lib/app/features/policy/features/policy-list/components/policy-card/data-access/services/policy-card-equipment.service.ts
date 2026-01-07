import { inject, Injectable } from '@angular/core';
import { PolicyCardService } from './policy-card.service';
import { PolicyProductCardModel } from '../../../../../../data-access/models/policy-product-card.model';
import { Router } from '@angular/router';
import { EQUIPMENT_POLICY_STATE_ENUM } from '../../../../../../data-access/enums/equipment-policy-state.enum';
import { PolicyCardTypeModel } from '../../../../data-access/models/policy-card-type.model';
import {
  ThirdPartyKeysEnum
} from '../../../../../../../vehicle/features/third-party/data-access/enums/third-party-keys.enum';
import { InsuranceKeysEnum } from '../../../../../../../../data-access/enums/insurance-keys.enum';
import { InsuranceTabEnum } from '../../../../../../data-access/enums/policy-list.enum';
import { SaleChannelEnum } from '../../../../../../../equipment/shared-steps/models/sales-channel.enum';
import {
  EquipmentActivateBundleBottomSheetComponent
} from '../../../../../policy-detail/components/equipment-activate-bundle-bottom-sheet/equipment-activate-bundle-bottom-sheet.component';
import { BottomSheetService } from '../../../../../../../../data-access/services/bottom-sheet.service';
import { PolicyApiService } from '../../../../../../../../data-access/services/policy/policy-api.service';
import { INSURANCE_APP_PREFIX } from '../../../../../../../../data-access/constants/insurance-app-prefix.constant';
import { InsuranceUrlsEnum } from '../../../../../../../../data-access/enums/insurance-urls.enum';

@Injectable({
  providedIn: 'root'
})
export class PolicyCardEquipmentService extends PolicyCardService {
  private router = inject(Router);
  private bottomSheetService = inject(BottomSheetService);
  private equipmentPolicyApiService = inject(PolicyApiService);

  handleButtonClicked(data: PolicyProductCardModel<EQUIPMENT_POLICY_STATE_ENUM>): Promise<boolean> {
    return new Promise(resolve => {
      switch (data.state) {
        case EQUIPMENT_POLICY_STATE_ENUM.ACTIVE:
        case EQUIPMENT_POLICY_STATE_ENUM.EffectiveActive:
          window.open(data.additional?.downloadLink, '_blank');
          resolve(true);
          break;
        case EQUIPMENT_POLICY_STATE_ENUM.Broken:
          this.handleDetailButtonClicked(data);
          resolve(true);
          break;
        case EQUIPMENT_POLICY_STATE_ENUM.CANCELLED:
        case EQUIPMENT_POLICY_STATE_ENUM.Expired:
          resolve(true);
          break;
        case EQUIPMENT_POLICY_STATE_ENUM.Renewal:
          this.router.navigate([`${INSURANCE_APP_PREFIX}/${InsuranceUrlsEnum.EquipmentRenewal}`], {queryParams: {code: data.additional?.uniqueCode}});
          resolve(true);
          break;
        case EQUIPMENT_POLICY_STATE_ENUM.PAID_POLICY:
          if (data.additional?.saleChannel === SaleChannelEnum.BUNDLED) {
            this.activateBundledPolicy(data).then(res => {
              resolve(res);
            });
          } else {
            this.continueJourney(data.additional.policyDraftNo.toString()).then(() => {
              resolve(true);
            });
          }
          break;
        case EQUIPMENT_POLICY_STATE_ENUM.PENDING:
        case EQUIPMENT_POLICY_STATE_ENUM.PAID_POLICY_PENDING:
          this.continueJourney(data.additional.policyDraftNo.toString()).then(() => {
            resolve(true);
          });
          break;
        case EQUIPMENT_POLICY_STATE_ENUM.NewForRenewal:
          this.router.navigate([`${INSURANCE_APP_PREFIX}/${InsuranceUrlsEnum.Equipment}`]);
          resolve(true);
          break;
        case EQUIPMENT_POLICY_STATE_ENUM.SubscriptionOffline:
          this.router.navigate([`${INSURANCE_APP_PREFIX}/${InsuranceUrlsEnum.Subscription}`], {queryParams: {code: data.additional?.uniqueCode}});
          resolve(true);
          break;
        default:
          resolve(true);
      }
    });
  }

  handleDetailButtonClicked(data: PolicyProductCardModel<PolicyCardTypeModel>): void {
    this.router.navigate([`${INSURANCE_APP_PREFIX}/${InsuranceUrlsEnum.PolicyDetail}`], {
      queryParams: {
        [ThirdPartyKeysEnum.FormId]: data.additional?.policyDraftNo,
        [InsuranceKeysEnum.POLICY_TYPE]: InsuranceTabEnum.DIGITAL_EQUIPMENT
      }
    });
  }

  getActionButtonText(data: PolicyProductCardModel<PolicyCardTypeModel>): string {
    switch (data.state) {
      case EQUIPMENT_POLICY_STATE_ENUM.ACTIVE:
      case EQUIPMENT_POLICY_STATE_ENUM.EffectiveActive:
        return 'دانلود بیمه‌نامه';
      case EQUIPMENT_POLICY_STATE_ENUM.NewForRenewal:
      case EQUIPMENT_POLICY_STATE_ENUM.Renewal:
        return 'تمدید';
      case EQUIPMENT_POLICY_STATE_ENUM.PAID_POLICY:
        if (data.additional?.saleChannel === SaleChannelEnum.BUNDLED) {
          return 'فعال سازی بیمه‌نامه';
        }
        return 'ادامه فرآیند';
      case EQUIPMENT_POLICY_STATE_ENUM.PENDING:
      case EQUIPMENT_POLICY_STATE_ENUM.PAID_POLICY_PENDING:
      case EQUIPMENT_POLICY_STATE_ENUM.SubscriptionOffline:
        return 'ادامه فرآیند';
    }
    if (data.additional?.hasClaim) {
      return 'پیگیری خسارت';
    }
  }

  getDetailButtonText(data: PolicyProductCardModel<PolicyCardTypeModel>): string {
    return 'جزییات';
  }

  showActionButton(data: PolicyProductCardModel<PolicyCardTypeModel>): boolean {
    switch (data.state) {
      case EQUIPMENT_POLICY_STATE_ENUM.CANCELLED:
      case EQUIPMENT_POLICY_STATE_ENUM.Broken:
      case EQUIPMENT_POLICY_STATE_ENUM.Expired:
        return false;
      default:
        return true;
    }
  }

  showDetailButton(data: PolicyProductCardModel<PolicyCardTypeModel>): boolean {
    return true;
  }

  getActionButtonRightIcon(data: PolicyProductCardModel<PolicyCardTypeModel>): { name: string; type: string } | null {
    return data.state === EQUIPMENT_POLICY_STATE_ENUM.EffectiveActive
    || data.state === EQUIPMENT_POLICY_STATE_ENUM.ACTIVE ? {
      name: 'download',
      type: 'linear'
    } : null;
  }

  isActionButtonBrand(data: PolicyProductCardModel<PolicyCardTypeModel>): boolean {
    return false;
  }

  activateBundledPolicy(data: PolicyProductCardModel<PolicyCardTypeModel>): Promise<boolean> {
    return new Promise(resolve => {
      this.bottomSheetService.open(EquipmentActivateBundleBottomSheetComponent, {
        name: 'EquipmentActivateBundleBottomSheetComponent',
        data
      }).afterDismissed().subscribe(res => {
        resolve(true);
        if (!res) {
          return;
        }
        this.handleDetailButtonClicked(data);
      });
    });
  }

  continueJourney(id: string): Promise<boolean> {
    const filterEntry = {
      order: [],
      restrictions: [{
        type: 'simple',
        field: 'PolicyNumber',
        value: id,
        operation: 'eq'
      }]
    };
    return new Promise(resolve => {
      this.equipmentPolicyApiService.getPolicyList(filterEntry).subscribe({
        next: value => {
          const data = value.data[0];
          this.router.navigate([`${INSURANCE_APP_PREFIX}/${InsuranceUrlsEnum.Equipment}`], {queryParams: {code: data.usedKey}});
          resolve(true);
        }
      });
    });
  }
}
