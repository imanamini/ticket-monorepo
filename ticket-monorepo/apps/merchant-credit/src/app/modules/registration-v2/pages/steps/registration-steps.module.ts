import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  SignatureConfirmationComponent
} from './step-signature/signature-confirmation/signature-confirmation.component';
import {
  RedirectingToServiceProviderComponent
} from './step-signature/redirecting-to-service-provider/redirecting-to-service-provider.component';
import { StepOpenBankAccountComponent } from './step-open-bank-account/step-open-bank-account.component';
import { StepSignatureComponent } from './step-signature/step-signature.component';
import { SignatureCallbackComponent } from './step-signature/signature-callback/signature-callback.component';
import { StepDocumentsComponent } from './step-documents/step-documents.component';
import { StepCreditScoreComponent } from './step-credit-score/step-credit-score.component';
import { StepRegistrationFeeComponent } from './step-registration-fee/step-registration-fee.component';
import { StepIdentificationComponent } from './step-identification/step-identification.component';
import { UserInterfaceModule } from '../../../../user-interface/user-interface.module';
import { RegistrationUiModule } from '../../../../sub-modules/registration-ui/registration-ui.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { IdentificationStepsModule } from './step-identification/identification-steps/identification-steps.module';
import { CoreModule } from '../../../../core/core.module';
import { BankAccountStepsModule } from './step-open-bank-account/bank-account-steps/bank-account-steps.module';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { AmountConfirmationComponent } from './step-documents/amount-confirmation/amount-confirmation.component';
import { NgButtonModule } from '@digipay/ng-button';
import {
  TermsConditionComponent
} from './step-documents/amount-confirmation/terms-condition/terms-condition.component';
import { SignaturePasswordComponent } from './step-signature/signature-password/signature-password.component';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';

@NgModule({
  declarations: [
    SignatureConfirmationComponent,
    RedirectingToServiceProviderComponent,
    StepOpenBankAccountComponent,
    StepSignatureComponent,
    SignatureCallbackComponent,
    StepDocumentsComponent,
    StepCreditScoreComponent,
    StepRegistrationFeeComponent,
    StepIdentificationComponent,
    AmountConfirmationComponent,
    TermsConditionComponent,
    SignaturePasswordComponent
  ],
  imports: [
    CommonModule,
    UserInterfaceModule,
    RegistrationUiModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatBottomSheetModule,
    IdentificationStepsModule,
    CoreModule,
    BankAccountStepsModule,
    ApiImageModule,
    NgButtonModule,
    NgxBadgeModule,
    NgxStatusResultModule
  ],
  exports: [
    AmountConfirmationComponent
  ],
  providers: []
})
export class RegistrationStepsModule {
}
