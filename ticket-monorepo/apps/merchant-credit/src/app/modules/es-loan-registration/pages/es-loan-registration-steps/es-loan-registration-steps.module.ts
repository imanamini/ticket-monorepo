import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../../../../core/core.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RegistrationV3UiModule } from '../../../../sub-modules/registration-v3-ui/registration-v3-ui.module';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { RegistrationUiModule } from '../../../../sub-modules/registration-ui/registration-ui.module';
import { UiNoteModule } from '../../../../user-interface/ui-components/ui-note/ui-note.module';
import { NgButtonModule } from '@digipay/ng-button';
import { MatDialogModule } from '@angular/material/dialog';
import { UiFormModule } from '../../../../user-interface/ui-components/ui-form/ui-form.module';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { UserInterfaceModule } from '../../../../user-interface/user-interface.module';
import { NgxDividerComponent } from '@digipay/ngx-divider';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxButtonComponent } from '@digipay/ngx-button';
import {
  EsLoanSamanService
} from './steps/es-loan-registeration-get-credit-amount-step/services/es-loan-saman.service';
import { NgxRadioButtonComponent } from '@digipay/ngx-radio-button';
import { NgxTooltipDirective } from '@digipay/ngx-tooltip';
import {
  EsLoanSamanBaseStepComponent,
  EsLoanSamanFundProviderActivationStepComponent,
  EsLoanSamanIcsMoreInfoDialogComponent,
  EsLoanSamanIcsStepComponent,
  EsLoanSamanIdentityEvaluationStepComponent,
  EsLoanSamanMaxCreditAmountStepComponent,
  EsLoanSamanMaxCreditCardComponent,
  EsLoanSamanStepperComponent,
} from './steps/es-loan-registeration-get-credit-amount-step/components';
import { NgxCalloutComponent } from '@digipay/ngx-callout';

@NgModule({
  declarations: [
    EsLoanSamanStepperComponent,
    EsLoanSamanBaseStepComponent,
    EsLoanSamanMaxCreditAmountStepComponent,
    EsLoanSamanMaxCreditCardComponent,
    EsLoanSamanIcsStepComponent,
    EsLoanSamanIcsMoreInfoDialogComponent,
    EsLoanSamanIdentityEvaluationStepComponent,
    EsLoanSamanFundProviderActivationStepComponent],

  imports: [
    CommonModule,
    CoreModule,
    MatSnackBarModule,
    RegistrationV3UiModule,
    FormsModule,
    ApiImageModule,
    RegistrationUiModule,
    UiNoteModule,
    NgButtonModule,
    MatDialogModule,
    UiFormModule,
    ReactiveFormsModule,
    UiFormFieldBuilderModule,
    NgxStatusResultModule,
    UserInterfaceModule,
    NgxDividerComponent,
    NgxIcon,
    NgxButtonComponent,
    NgxRadioButtonComponent,
    NgxTooltipDirective,
    NgxCalloutComponent
  ],
  exports: [
    EsLoanSamanStepperComponent,
    EsLoanSamanMaxCreditCardComponent
  ],
  providers: [
    EsLoanSamanService
  ]
})
export class EsLoanRegistrationStepsModule {
}
