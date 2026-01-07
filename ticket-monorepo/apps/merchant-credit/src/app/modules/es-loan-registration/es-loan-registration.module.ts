import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EsLoanRegistrationRoutingModule } from './es-loan-registration-routing.module';

import { EsLoanStepComponent } from '../../sub-modules/es-loan-ui/es-loan-step/es-loan-step.component';
import {
  EsLoanRegistrationOverviewComponent
} from './pages/es-loan-registration-overview/es-loan-registration-overview.component';
import { EsLoanRegistrationComponent } from './es-loan-registration.component';
import {
  EsLoanRegistrationBaseStepComponent,
  EsLoanRegisterationGetCreditAmountStepComponent,
  EsLoanRegistrationStepsComponent,
  EsLoanSendCheckStepComponent,
  EsLoanSettlementSelectLoanAmountStepComponent,
  EsLoanSettlementPaymentStepComponent,
  EsLoanRegisterationIcsReportingStepComponent
} from './pages/es-loan-registration-steps';
import {
  EsLoanRegistrationStepsModule
} from './pages/es-loan-registration-steps/es-loan-registration-steps.module';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { NgxIcon } from '@digipay/ngx-icon';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { NgxTooltipDirective } from '@digipay/ngx-tooltip';
import { NgxDividerComponent } from '@digipay/ngx-divider';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { UiFormModule } from '../../user-interface/ui-components/ui-form/ui-form.module';
import { ReactiveFormsModule } from '@angular/forms';
import { UserInterfaceModule } from '../../user-interface/user-interface.module';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import {
  EsLoanRegistrationIcsReportingStepperComponent
} from './pages/es-loan-registration-steps/steps/es-loan-registeration-ics-reporting-step/components/es-loan-registration-ics-reporting-stepper/es-loan-registration-ics-reporting-stepper.component';
import {
  EsLoanRegistrationIcsReportingConfirmStepComponent
} from './pages/es-loan-registration-steps/steps/es-loan-registeration-ics-reporting-step/components/steps/es-loan-registration-ics-reporting-confirm-step/es-loan-registration-ics-reporting-confirm-step.component';
import {
  EsLoanRegistrationIcsReportingSendOtpStepComponent
} from './pages/es-loan-registration-steps/steps/es-loan-registeration-ics-reporting-step/components/steps/es-loan-registration-ics-reporting-send-otp-step/es-loan-registration-ics-reporting-send-otp-step.component';
import {
  EsLoanRegistrationIcsReportingCheckScoreStepComponent
} from './pages/es-loan-registration-steps/steps/es-loan-registeration-ics-reporting-step/components/steps/es-loan-registration-ics-reporting-check-score-step/es-loan-registration-ics-reporting-check-score-step.component';

@NgModule({
  declarations: [EsLoanRegistrationComponent,
    EsLoanRegistrationOverviewComponent,
    EsLoanRegisterationGetCreditAmountStepComponent,
    EsLoanRegistrationBaseStepComponent,
    EsLoanRegistrationStepsComponent,
    EsLoanSendCheckStepComponent,
    EsLoanSettlementSelectLoanAmountStepComponent,
    EsLoanSettlementPaymentStepComponent,
    EsLoanRegisterationIcsReportingStepComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EsLoanRegistrationRoutingModule,
    EsLoanStepComponent,
    EsLoanRegistrationStepsModule,
    NgxButtonComponent,
    NgxStatusResultModule,
    NgxIcon,
    PipesModule,
    NgxCalloutComponent,
    NgxTooltipDirective,
    NgxDividerComponent,
    UiFormFieldBuilderModule,
    UiFormModule,
    UserInterfaceModule,
    NgxBadgeModule,
    EsLoanRegistrationIcsReportingStepperComponent,
    EsLoanRegistrationIcsReportingConfirmStepComponent,
    EsLoanRegistrationIcsReportingSendOtpStepComponent,
    EsLoanRegistrationIcsReportingCheckScoreStepComponent
  ],
})
export class EsLoanRegistrationModule {
}
