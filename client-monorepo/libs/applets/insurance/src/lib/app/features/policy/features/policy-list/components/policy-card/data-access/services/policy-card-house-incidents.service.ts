import { inject, Injectable } from '@angular/core';
import { PolicyCardService } from './policy-card.service';
import { PolicyProductCardModel } from '../../../../../../data-access/models/policy-product-card.model';
import {
  ThirdPartyKeysEnum
} from '../../../../../../../vehicle/features/third-party/data-access/enums/third-party-keys.enum';
import { InsuranceKeysEnum } from '../../../../../../../../data-access/enums/insurance-keys.enum';
import { InsuranceTabEnum } from '../../../../../../data-access/enums/policy-list.enum';
import { Router } from '@angular/router';
import { MessageService } from '@client-monorepo/common/utilities';
import { DownloadService } from '../../../../../../../../data-access/services/download.service';
import {
  HOUSE_INCIDENTS_POLICY_STATE_ENUM
} from '../../../../../../data-access/enums/house-incidents-policy-state.enum';
import { HOUSE_INCIDENTS_URLS } from '../../../../../../../house-incidents/data-access/constants/house-incidents-urls';
import {
  QueryParamHouseIncidentEnum
} from '../../../../../../../house-incidents/data-access/enums/query-param-house-incident.enum';
import {
  HouseIncidentsApiService
} from '../../../../../../../house-incidents/data-access/services/house-incidents-api.service';
import { PolicyCardTypeModel } from '../../../../data-access/models/policy-card-type.model';
import { INSURANCE_APP_PREFIX } from '../../../../../../../../data-access/constants/insurance-app-prefix.constant';
import { InsuranceUrlsEnum } from '../../../../../../../../data-access/enums/insurance-urls.enum';

@Injectable({
  providedIn: 'root'
})
export class PolicyCardHouseIncidentsService extends PolicyCardService {
  private router = inject(Router);
  private houseIncidentsApiService = inject(HouseIncidentsApiService);
  private messageService = inject(MessageService);
  private downloadService = inject(DownloadService);

  handleButtonClicked(data: PolicyProductCardModel<PolicyCardTypeModel>): Promise<boolean> {
    return new Promise(resolve => {
      switch (data.state) {
        case HOUSE_INCIDENTS_POLICY_STATE_ENUM.Issued:
          const id = data.id as string;
          this.houseIncidentsApiService.downloadPolicy(id).subscribe({
            next: data => {
              void this.downloadService.download(data.body, 'application/pdf', 'policy-' + id);
              this.messageService.showSuccessMessage('بیمه‌نامه با موفقیت دانلود شد.');
              resolve(true);
            }
          });
          break;
        case HOUSE_INCIDENTS_POLICY_STATE_ENUM.Paid:
          this.router.navigate([HOUSE_INCIDENTS_URLS.COMPLETE_INFO], {
            queryParams: {
              [QueryParamHouseIncidentEnum.ApplicationId]: data.id
            }
          });
          resolve(true);
          break;
      }
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
    switch (data.state) {
      case HOUSE_INCIDENTS_POLICY_STATE_ENUM.Issued:
        return 'دانلود بیمه‌نامه';
      case HOUSE_INCIDENTS_POLICY_STATE_ENUM.Paid:
        return 'تکمیل اطلاعات';
    }
  }

  getDetailButtonText(data: PolicyProductCardModel<PolicyCardTypeModel>): string {
    return 'جزییات';
  }

  showActionButton(data: PolicyProductCardModel<PolicyCardTypeModel>): boolean {
    switch (data.state) {
      case HOUSE_INCIDENTS_POLICY_STATE_ENUM.Issued:
      case HOUSE_INCIDENTS_POLICY_STATE_ENUM.Paid:
        return true;
      default:
        return false;
    }
  }

  showDetailButton(data: PolicyProductCardModel<PolicyCardTypeModel>): boolean {
    return false;
  }

  getActionButtonRightIcon(data: PolicyProductCardModel<PolicyCardTypeModel>): { name: string; type: string } | null {
    return data.state === HOUSE_INCIDENTS_POLICY_STATE_ENUM.Issued ? {
      name: 'download',
      type: 'linear'
    } : null;
  }

  isActionButtonBrand(data: PolicyProductCardModel<PolicyCardTypeModel>): boolean {
    return false;
  }
}
