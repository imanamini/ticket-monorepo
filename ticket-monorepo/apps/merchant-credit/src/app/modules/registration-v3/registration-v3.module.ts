import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrationV3RoutingModule } from './registration-v3-routing.module';
import { CoreModule } from '../../core/core.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RegistrationV3UiModule } from '../../sub-modules/registration-v3-ui/registration-v3-ui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { RegistrationUiModule } from '../../sub-modules/registration-ui/registration-ui.module';
import { UiNoteModule } from '../../user-interface/ui-components/ui-note/ui-note.module';
import { NgButtonModule } from '@digipay/ng-button';
import { SmartDialog } from '../../user-interface/services/smart-dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { UiFormModule } from '../../user-interface/ui-components/ui-form/ui-form.module';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { UserInterfaceModule } from '../../user-interface/user-interface.module';
import { RegistrationV3Service } from './services/registration-v3.service';
import { FactoryService } from './services/factory.service';
import { RegistrationV3Component } from './registration-v3.component';
import {
  StepperComponent,
  MaxCreditAmountStepComponent,
  MaxCreditAmountCardComponent,
  HeaderProfileViewDialogComponent,
  MaxCreditAmountConfirmDialogComponent,
  IcsStepComponent,
  IdentityEvaluationStepComponent,
  FundProviderActivationStepComponent,
  StepsBaseComponent,
  IcsMoreInfoDialogComponent,
  FundProviderBranchInfoCardComponent,
  FundProviderBranchInfoDialogComponent,
  FundProviderBranchInfoComponent
} from './components';
import { NgxDividerComponent } from '@digipay/ngx-divider';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxButtonComponent } from '@digipay/ngx-button';

@NgModule({
  declarations: [
    RegistrationV3Component,
    StepperComponent,
    MaxCreditAmountStepComponent,
    MaxCreditAmountCardComponent,
    HeaderProfileViewDialogComponent,
    MaxCreditAmountConfirmDialogComponent,
    IcsStepComponent,
    IdentityEvaluationStepComponent,
    FundProviderActivationStepComponent,
    StepsBaseComponent,
    IcsMoreInfoDialogComponent,
    FundProviderBranchInfoCardComponent,
    FundProviderBranchInfoDialogComponent,
    FundProviderBranchInfoComponent
  ],
  imports: [
    CommonModule,
    RegistrationV3RoutingModule,
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
    NgxButtonComponent
  ],
  providers: [
    SmartDialog,
    RegistrationV3Service,
    FactoryService
  ]
})
export class RegistrationV3Module {
}
