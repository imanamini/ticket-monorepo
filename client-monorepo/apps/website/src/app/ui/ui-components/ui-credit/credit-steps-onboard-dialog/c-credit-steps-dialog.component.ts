import {Component, Inject, PLATFORM_ID} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import {Subscription} from 'rxjs';
import {PlanGroup} from '../../../models/credit/credit-plan-group';
import {LayoutService} from '../../../../website/services/layout.service';
import {DialogBottomSheetService} from '../../../../core/services/dialog-bottom-sheet.service';
import {PRE_REGISTRATION_STEP_TYPE} from '../../../../api/clients/credit/pre-registration-step';
import {environment} from '../../../../../environments/environment';
import {PreRegisterPlanInfoComponent} from './pre-register-plan-info/pre-register-plan-info.component';
import {
  PreRegistrationGroupDetailComponent
} from './pre-registration-group-detail/pre-registration-group-detail.component';
import {PreRegisterChequeConfirmComponent} from './pre-register-cheque-confirm/pre-register-cheque-confirm.component';
import {isPlatformBrowser, NgClass, NgFor, NgSwitch, NgSwitchCase} from '@angular/common';
import {NgxIcon} from '@digipay/ngx-icon';

@Component({
  selector: 'app-c-credit-steps-dialog',
  templateUrl: './c-credit-steps-dialog.component.html',
  styleUrls: ['./c-credit-steps-dialog.component.scss'],
  standalone: true,
  imports: [
    NgFor,
    NgClass,
    NgSwitch,
    NgSwitchCase,
    PreRegisterChequeConfirmComponent,
    PreRegistrationGroupDetailComponent,
    PreRegisterPlanInfoComponent,
    NgxIcon,
  ],
})
export class CCreditStepsDialogComponent {
  steps = [];
  PRE_REGISTRATION_STEP_TYPE = PRE_REGISTRATION_STEP_TYPE;
  activeStepType = 0;
  selectedPlanGroup: PlanGroup;
  subscription: Subscription;
  utmMedium = 'c-credit';
  orderId: string;
  merchant: string;
  amount: string;
  reservationParams = '';

  constructor(
    private layoutService: LayoutService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    @Inject(MAT_BOTTOM_SHEET_DATA) public bottomSheetData: any,
    private dialogService: DialogBottomSheetService,
    @Inject(PLATFORM_ID) private platformId: string,
  ) {
    this.subscription = this.layoutService.isMobile.subscribe((value) => {
      this.selectedPlanGroup = value ? this.bottomSheetData.selectedPlanGroup : this.dialogData.selectedPlanGroup;
      this.steps = value ? this.bottomSheetData.steps : this.dialogData.steps;
      this.utmMedium = value ? this.bottomSheetData.utmMedium : this.dialogData.utmMedium;
      this.orderId = value ? this.bottomSheetData.orderId : this.dialogData.orderId;
      this.amount = value ? this.bottomSheetData.amount : this.dialogData.amount;
      this.merchant = value ? this.bottomSheetData.merchant : this.dialogData.merchant;
      this.reservationParams = this.orderId ? '&orderId=' + this.orderId + '&amount=' + this.amount : '';
      this.steps[0].active = true;
    });
  }

  closeDialog(): void {
    this.dialogService.close(true);
  }

  findStepIndexByType(type: PRE_REGISTRATION_STEP_TYPE): number {
    return this.steps.findIndex((step) => step.type === type);
  }

  onBack() {
    if (this.activeStepType > 0) {
      this.steps[this.activeStepType].active = false;
      this.activeStepType--;
    } else if (this.activeStepType === 0) {
      this.closeDialog();
    }
  }

  onNext() {
    if (this.activeStepType + 1 < this.steps.length) {
      this.steps[this.activeStepType + 1].active = true;
      this.activeStepType++;
    } else if (this.activeStepType + 1 === this.steps.length) {
      this.goToApplication();
    }
  }

  goToApplication() {
    if ((environment.name === 'staging' || environment.name === 'dev') && isPlatformBrowser(this.platformId)) {
      window.location.href =
        `${environment.appUrl}/hub?rt=service/credit/pre-register/submit/${this.selectedPlanGroup.planId}/${this.selectedPlanGroup.groupId}?utm_source=website&utm_medium=${this.utmMedium}&balance=${this.selectedPlanGroup.creditAmount}&merchant=${this.merchant}${this.reservationParams}`;
    } else if (environment.name === 'production' && isPlatformBrowser(this.platformId)) {
      window.location.href =
        `${environment.appUrl}/hub?rt=service/credit/pre-register/submit/${this.selectedPlanGroup.planId}/${this.selectedPlanGroup.groupId}?utm_source=website&utm_medium=${this.utmMedium}&balance=${this.selectedPlanGroup.creditAmount}&merchant=${this.merchant}${this.reservationParams}`;
    }
  }
}
