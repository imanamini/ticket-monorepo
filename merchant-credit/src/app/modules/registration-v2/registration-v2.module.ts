import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrationV2RoutingModule } from './registration-v2-routing.module';
import { UserInterfaceModule } from '../../user-interface/user-interface.module';
import { RegistrationUiModule } from '../../sub-modules/registration-ui/registration-ui.module';
import { RegistrationManagerComponent } from './pages/registration-manager/registration-manager.component';
import {  MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  RegistrationOverviewPageComponent
} from './pages/registration-overview-page/registration-overview-page.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogOtpComponent } from './dialogs/dialog-otp/dialog-otp.component';
import { StepFinishedComponent } from './pages/steps/step-finished/step-finished.component';
import { FeePaymentCallbackComponent } from './pages/fee-payment-callback/fee-payment-callback.component';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { SmartDialog } from '../../user-interface/services/smart-dialog';
import { CoreModule } from '../../core/core.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { RegistrationStepsModule } from './pages/steps/registration-steps.module';
import { RegistrationPathFinderComponent } from './pages/registration-path-finder/registration-path-finder.component';
import { NgButtonModule } from '@digipay/ng-button';

@NgModule({
  declarations: [
    RegistrationManagerComponent,
    RegistrationOverviewPageComponent,
    DialogOtpComponent,
    StepFinishedComponent,
    FeePaymentCallbackComponent,
    RegistrationPathFinderComponent,

  ],
  imports: [
    CommonModule,
    RegistrationV2RoutingModule,
    UserInterfaceModule,
    RegistrationUiModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatBottomSheetModule,
    MatDialogModule,
    CoreModule,
    ApiImageModule,
    RegistrationStepsModule,
    NgButtonModule
  ],
  providers: [
    SmartDialog
  ]
})
export class RegistrationV2Module {
}
