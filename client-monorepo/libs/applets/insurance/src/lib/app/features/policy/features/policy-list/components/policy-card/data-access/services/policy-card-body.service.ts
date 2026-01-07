import { inject, Injectable } from '@angular/core';
import { PolicyCardService } from './policy-card.service';
import { PolicyProductCardModel } from '../../../../../../data-access/models/policy-product-card.model';
import {
  ThirdPartyKeysEnum
} from '../../../../../../../vehicle/features/third-party/data-access/enums/third-party-keys.enum';
import { InsuranceKeysEnum } from '../../../../../../../../data-access/enums/insurance-keys.enum';
import { InsuranceTabEnum } from '../../../../../../data-access/enums/policy-list.enum';
import { Router } from '@angular/router';
import { VEHICLE_BODY_POLICY_STATE_ENUM } from '../../../../../../data-access/enums/vehicle-body-policy-state.enum';
import { PolicyCardTypeModel } from '../../../../data-access/models/policy-card-type.model';
import { PolicyApiService } from '../../../../../../../vehicle/data-access/services/third-party/policy-api.service';
import { INSURANCE_APP_PREFIX } from '../../../../../../../../data-access/constants/insurance-app-prefix.constant';
import { InsuranceUrlsEnum } from '../../../../../../../../data-access/enums/insurance-urls.enum';

@Injectable({
  providedIn: 'root'
})
export class PolicyCardBodyService extends PolicyCardService {
  private router = inject(Router);
  policyApiService = inject(PolicyApiService);

  handleButtonClicked(data: PolicyProductCardModel<PolicyCardTypeModel>): Promise<boolean> {
    return new Promise(resolve => {
      this.policyApiService.downloadPolicyBody(data.additional.id as number).subscribe({
        next: response => {
          window.open(response.result, '_blank');
          resolve(true);
        },
        error: () => {
          resolve(false);
        }
      });
    });
  }

  handleDetailButtonClicked(data: PolicyProductCardModel<PolicyCardTypeModel>): void {
    this.router.navigate([`${INSURANCE_APP_PREFIX}/${InsuranceUrlsEnum.PolicyDetail}`], {
      queryParams: {
        [ThirdPartyKeysEnum.FormId]: data.id,
        [InsuranceKeysEnum.POLICY_TYPE]: InsuranceTabEnum.CAR_BODY
      }
    });
  }

  getActionButtonText(data: PolicyProductCardModel<PolicyCardTypeModel>): string {
    switch (data.state as unknown as VEHICLE_BODY_POLICY_STATE_ENUM) {
      case VEHICLE_BODY_POLICY_STATE_ENUM.ISSUED:
        return 'دانلود بیمه‌نامه';
      default:
        return '';
    }
  }

  getDetailButtonText(data: PolicyProductCardModel<PolicyCardTypeModel>): string {
    return 'جزییات';
  }

  showActionButton(data: PolicyProductCardModel<PolicyCardTypeModel>): boolean {
    return (data.state as unknown as VEHICLE_BODY_POLICY_STATE_ENUM) ===
      VEHICLE_BODY_POLICY_STATE_ENUM.ISSUED;
  }

  showDetailButton(data: PolicyProductCardModel<PolicyCardTypeModel>): boolean {
    return true;
  }

  getActionButtonRightIcon(data: PolicyProductCardModel<PolicyCardTypeModel>): { name: string; type: string } | null {
    return (data.state as unknown as VEHICLE_BODY_POLICY_STATE_ENUM) ===
    VEHICLE_BODY_POLICY_STATE_ENUM.ISSUED ? {
      name: 'download',
      type: 'linear'
    } : null;
  }

  isActionButtonBrand(data: PolicyProductCardModel<PolicyCardTypeModel>): boolean {
    return data.state === VEHICLE_BODY_POLICY_STATE_ENUM.DEBTOR;
  }
}
