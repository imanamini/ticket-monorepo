import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { PreRegistrationService } from '../services/pre-registration.service';
import { PRE_REGISTRATION_STEP_TYPE, PreRegistrationStep } from '../services/pre-registration-step';
import { CreditSelectRegistrationFlowBottomSheetComponent } from '../pre-registration-steps/credit-select-registration-flow-bottom-sheet/credit-select-registration-flow-bottom-sheet.component';
import { PreRegistrationErrorType } from '../services/pre-registration-error-type';
import { Subscription } from 'rxjs';
import { PreRegistrationStepBaseComponent } from '../pre-registration-steps/pre-registration-step-base/pre-registration-step-base.component';
import { PreRegistrationStepCollateralComponent } from '../pre-registration-steps/pre-registration-step-collateral/pre-registration-step-collateral.component';
import { PreRegistrationStepSubscriptionComponent } from '../pre-registration-steps/pre-registration-step-subscription/pre-registration-step-subscription.component';
import { PreRegistrationStepConfirmPlanComponent } from '../pre-registration-steps/pre-registration-step-confirm-plan/pre-registration-step-confirm-plan.component';
import { PreRegistrationNoPlanComponent } from '../pre-registration-no-plan/pre-registration-no-plan.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { PreRegistrationStepPreSubscriptionComponent } from '../pre-registration-steps/pre-registration-step-pre-subscription/pre-registration-step-pre-subscription.component';
import { CreditPageLoadingComponent } from '../../components/credit-page-loading/credit-page-loading.component';
import { PreRegistrationStepConditionsPlanComponent } from '../pre-registration-steps/pre-registration-step-conditions-plan/pre-registration-step-conditions-plan.component';

@Component({
  selector: 'app-pre-registration-step-control',
  templateUrl: './pre-registration-step-control.component.html',
  styleUrls: ['./pre-registration-step-control.component.scss'],
  imports: [
    PreRegistrationStepBaseComponent,
    PreRegistrationStepCollateralComponent,
    PreRegistrationStepSubscriptionComponent,
    PreRegistrationStepConfirmPlanComponent,
    PreRegistrationNoPlanComponent,
    PreRegistrationStepPreSubscriptionComponent,
    CreditPageLoadingComponent,
    PreRegistrationStepConditionsPlanComponent,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreRegistrationStepControlComponent implements OnInit, OnDestroy {
  activeStep = signal<PreRegistrationStep | null>(null);
  stepType = signal(PRE_REGISTRATION_STEP_TYPE);
  initiated = signal<boolean>(false);
  errorType = signal<PreRegistrationErrorType | null>(null);
  sub!: Subscription;
  bottomSheetService = inject(NgxBottomSheetService);
  preRegistrationService = inject(PreRegistrationService);

  ngOnInit(): void {
    this.initiateData();
  }

  initiateData(): void {
    this.preRegistrationService
      .init()
      .then(() => {
        this.initiated.set(true);
      })
      .catch((error) => {
        console.error('[PreRegistrationStepControl] Error initializing:', error);
        this.initiated.set(true);
        // Error will be shown via errorType subscription
      });
    this.preRegistrationService.errorType.subscribe((value) => {
      this.errorType.set(value!);
    });
    this.sub = this.preRegistrationService.activeStepIndex.subscribe((value) => {
      const activeStep = this.preRegistrationService.steps[value];
      if (activeStep.type === PRE_REGISTRATION_STEP_TYPE.JOURNEY_TYPE) {
        this.showSelectJourneyType();
        return;
      }
      this.activeStep.set(this.preRegistrationService.steps[value]);
    });
  }

  showSelectJourneyType() {
    const registerFlow: any = {};
    this.preRegistrationService.filteredPlans.forEach((item) => {
      registerFlow[item.planRegistrationFlowDto.type] = true;
    });
    if (Object.keys(registerFlow).length <= 1) {
      this.preRegistrationService.nextStep();
      return;
    }
    this.bottomSheetService.openBottomSheet(CreditSelectRegistrationFlowBottomSheetComponent, {});

    const onCloseBottomSheet = this.bottomSheetService.onClose.subscribe(() => {
      onCloseBottomSheet.unsubscribe();
      const result: any = this.bottomSheetService.outputData();
      if (result.nextStep) {
        this.preRegistrationService.nextStep();
      } else {
        this.preRegistrationService.prevStep();
      }
    });
    return;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
