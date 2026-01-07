import { Component, inject, OnInit } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import moment from 'jalali-moment';

import { ThirdPartyApiService } from '../../../../../../data-access/services/third-party/third-party-api.service';
import {
  UiLoadingSpinnerComponent
} from '../../../../../../../../components/ui-loading-spinner/ui-loading-spinner.component';
import { InsIconComponent } from '../../../../../../components/ins-icon/ins-icon.component';
import { BaseComponent } from '../../../../../../../../components/base/base.component';
import { InsButtonModeEnum } from '../../../../../../../../data-access/enums/ins-button-mode.enum';
import { VehicleSharedService } from '../../../../../../data-access/services/vehicle-shared.service';
import { ActionButtonsComponent } from '../../../../../../../../components/action-buttons/action-buttons.component';
import { ThirdPartyUrlsEnum } from '../../../../data-access/enums/third-party-urls.enum';
import { IconEnum } from '../../../../../../../../data-access/enums/icon.enum';
import { CompleteOrderModel } from './complete-order.model';
import { InsuranceUrlsEnum } from '../../../../../../../../data-access/enums/insurance-urls.enum';
import { InsuranceKeysEnum } from '../../../../../../../../data-access/enums/insurance-keys.enum';
import { DpxService } from '../../../../../../../../data-access/services/dpx.service';
import { StoreService } from '../../../../data-access/services/store.service';
import { CloseService } from '../../../../../../data-access/services/shared/close.service';
import { InsuranceTabEnum } from '../../../../../../../policy/data-access/enums/policy-list.enum';
import { InsuranceProductTypeEnum } from '../../../../../../../../data-access/enums/Insurance-product-type.enum';
import { INSURANCE_APP_PREFIX } from '../../../../../../../../data-access/constants/insurance-app-prefix.constant';

@Component({
  selector: 'complete-order',
  standalone: true,
  imports: [InsIconComponent, ActionButtonsComponent, NgTemplateOutlet, UiLoadingSpinnerComponent],
  templateUrl: './complete-order.component.html',
  styleUrl: './complete-order.component.scss',
})
export class CompleteOrderComponent extends BaseComponent implements OnInit {
  private thirdPartySharedService = inject(VehicleSharedService);
  private thirdPartyApiService = inject(ThirdPartyApiService);
  private dpxService = inject(DpxService);
  private closeService = inject(CloseService);
  private storeService = inject(StoreService);

  protected readonly IconEnum = IconEnum;
  protected readonly InsButtonModeEnum = InsButtonModeEnum;
  protected showState: 'success' | 'later' | 'loading' = 'loading';
  public model: CompleteOrderModel;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.init();
  }

  private init(): void {
    this.model = null;
    this.storeService.getStoreDataAsObservable().subscribe({
      next: (storeData) => {
        if (!storeData) {
          return;
        }
        this.checkCompleteOrderStatus(this.storeService.getFormId());
      },
    });
  }

  private checkCompleteOrderStatus(applicationFormId: string): void {
    this.thirdPartyApiService.checkCompleteJourney(applicationFormId).subscribe(
      (status) => {
        if (status.success) {
          this.model = status.result;
          if (this.model.currentInsuranceDeadline) {
            this.model.currentInsuranceDeadline = moment(this.model.currentInsuranceDeadline).locale('fa').format('YYYY/MM/DD');
          }
          this.showState = status.result?.isJourneyCompleted ? 'success' : 'later';
        }
      },
      () => (this.showState = 'later'),
    );
  }

  handleActiveButtonClicked(): void {
    if (this.showState === 'success') {
      this.thirdPartySharedService.navigate(
        `/${INSURANCE_APP_PREFIX}/${InsuranceUrlsEnum.PolicyDetail}`,
        {
          queryParams: { [InsuranceKeysEnum.POLICY_TYPE]: InsuranceTabEnum.THIRD_PARTY },
          baseUrl: false,
          queryParamsHandling: 'merge',
        },
        InsuranceProductTypeEnum.ThirdParty,
      );
    } else if (this.showState === 'later') {
      this.thirdPartySharedService.navigate(
        ThirdPartyUrlsEnum.UserInfo,
        null,
        InsuranceProductTypeEnum.ThirdParty,
      );
    }
  }

  handleDeActiveButtonClicked(): void {
    if (this.dpxService.IsEnteredFromDpx) {
      this.dpxService.goToDpxHome();
    } else {
      this.thirdPartySharedService.navigate(
        INSURANCE_APP_PREFIX,
        {
          baseUrl: false,
          queryParamsHandling: null,
        },
        InsuranceProductTypeEnum.ThirdParty,
      );
    }
  }

  handleCloseClicked(): void {
    this.closeService.close();
  }
}
