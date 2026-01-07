import { Component, inject, OnInit, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import moment from 'jalali-moment';
import { ThirdPartyMotorDirective } from '../../directives/third-party-motor.directive';
import { IconEnum } from '../../../../../../data-access/enums/icon.enum';
import { InsButtonModeEnum } from '../../../../../../data-access/enums/ins-button-mode.enum';
import { DpxService } from '../../../../../../data-access/services/dpx.service';
import { CompleteOrderModel } from './motor-complete-order.model';
import { InsIconComponent } from '../../../../components/ins-icon/ins-icon.component';
import { ActionButtonsComponent } from '../../../../../../components/action-buttons/action-buttons.component';
import {
  UiLoadingSpinnerComponent
} from '../../../../../../components/ui-loading-spinner/ui-loading-spinner.component';
import { InsuranceUrlsEnum } from '../../../../../../data-access/enums/insurance-urls.enum';
import { InsuranceTabEnum } from '../../../../../policy/data-access/enums/policy-list.enum';
import { InsuranceKeysEnum } from '../../../../../../data-access/enums/insurance-keys.enum';
import { ThirdPartyMotorKeysEnum } from '../../data-access/enums/third-party-motor-keys.enum';
import { THIRD_PARTY_MOTOR_ROUTE } from '../../data-access/constants/third-party-motor-route.const';
import { INSURANCE_APP_PREFIX } from '../../../../../../data-access/constants/insurance-app-prefix.constant';

@Component({
  selector: 'motor-complete-order',
  standalone: true,
  imports: [
    InsIconComponent,
    ActionButtonsComponent,
    NgTemplateOutlet,
    UiLoadingSpinnerComponent,
    InsIconComponent,
    ActionButtonsComponent,
    UiLoadingSpinnerComponent,
  ],
  templateUrl: './motor-complete-order.component.html',
  styleUrl: './motor-complete-order.component.scss',
})
export class MotorCompleteOrderComponent extends ThirdPartyMotorDirective implements OnInit {
  private readonly dpxService = inject(DpxService);

  protected readonly IconEnum = IconEnum;
  protected readonly InsButtonModeEnum = InsButtonModeEnum;

  protected showState = signal<'success' | 'later' | 'loading'>('loading');
  protected model = signal<CompleteOrderModel | null>(null);

  ngOnInit(): void {
    const formId = this.route.snapshot.queryParams[ThirdPartyMotorKeysEnum.FormId];
    if (formId) {
      this.init(formId);
    } else {
      this.showState.set('later');
    }
  }

  private init(formId: string): void {
    this.model.set(null);
    this.checkCompleteOrderStatus(formId);
  }

  private checkCompleteOrderStatus(applicationFormId: string): void {
    super.addSubscription(
      this.motorApiService.checkCompleteJourney(applicationFormId).subscribe(
        (status) => {
          if (status.success) {
            this.model.set(status.result);
            if (this.model().currentInsuranceDeadline) {
              this.model().currentInsuranceDeadline = moment(this.model().currentInsuranceDeadline).locale('fa').format('YYYY/MM/DD');
            }
            this.showState.set(status.result?.isJourneyCompleted ? 'success' : 'later');
          }
        },
        () => this.showState.set('later'),
      ),
    );
  }

  protected onClose(): void {
    if (this.dpxService.IsEnteredFromDpx) {
      this.dpxService.goToDpxHome();
    } else {
      this.router.navigate(['/' + INSURANCE_APP_PREFIX], {
        queryParamsHandling: 'merge',
      });
    }
  }

  protected onNext(route: string): void {
    if (this.showState() === 'success') {
      this.router.navigate([`/${INSURANCE_APP_PREFIX}/${InsuranceUrlsEnum.PolicyDetail}`], {
        queryParams: {
          [InsuranceKeysEnum.POLICY_TYPE]: InsuranceTabEnum.THIRD_PARTY_MOTOR,
        },
        queryParamsHandling: 'merge',
      });
    } else if (this.showState() === 'later') {
      this.router.navigate([`/${INSURANCE_APP_PREFIX}/${InsuranceUrlsEnum.VehicleThirdPartyMotor}/${THIRD_PARTY_MOTOR_ROUTE.UserInfo}`], {
        queryParams: {
          [ThirdPartyMotorKeysEnum.FormId]: this.storeService.getFormId(),
        },
        queryParamsHandling: 'merge',
      });
    }
  }
}
