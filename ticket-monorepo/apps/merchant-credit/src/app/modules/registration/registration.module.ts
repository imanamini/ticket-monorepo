import { NgModule } from '@angular/core';
import { RegistrationRoutingModule } from './registration-routing.module';
import { StepperComponent } from './stepper/stepper.component';
import { RegistrationComponent } from './registration.component';
import { LimitationComponent } from './pages/limitation/limitation.component';
import { LimitationSkeletonComponent } from './pages/limitation/limitation-skeleton/limitation-skeleton.component';
import { SelectAmountSliderComponent } from './pages/limitation/select-credit-amount-slider/select-amount-slider.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { UserInterfaceModule } from '../../user-interface/user-interface.module';
import { EstimationOfLimitationDialogComponent } from './pages/estimation-of-limitation-dialog/estimation-of-limitation-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CancelRegistrationComponent } from './cancel-registration/cancel-registration.component';
import { CreditReviseStepComponent } from './steps/credit-revise-step/credit-revise-step.component';
import { CreditReviseSelectDocumentsComponent } from './steps/credit-revise-step/credit-revise-select-documents/credit-revise-select-documents.component';
import { CreditReviseSelectDocumentsResultComponent } from './steps/credit-revise-step/credit-revise-select-documents-result/credit-revise-select-documents-result.component';
import { CreditReviseCheckboxComponent } from './steps/credit-revise-step/credit-revise-checkbox/credit-revise-checkbox.component';
import { StepResultComponent } from './steps/step-result/step-result.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { OpeningBankAccountInfoBoxesComponent } from './steps/step-result/opening-bank-account-info-boxes/opening-bank-account-info-boxes.component';
import { OpeningBankAccountInfoComponent } from './steps/step-result/opening-bank-account-info/opening-bank-account-info.component';
import { OpeningBankAccountInfoBottomSheetComponent } from './steps/step-result/opening-bank-account-info-bottom-sheet/opening-bank-account-info-bottom-sheet.component';
import { MatIconModule } from '@angular/material/icon';
import {
  DigipayCreditReviseFeeComponent
} from './steps/credit-revise-step/digipay-credit-revise-fee/digipay-credit-revise-fee.component';
import { CoreModule } from '../../core/core.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    StepperComponent,
    RegistrationComponent,
    LimitationComponent,
    LimitationSkeletonComponent,
    SelectAmountSliderComponent,
    EstimationOfLimitationDialogComponent,
    CancelRegistrationComponent,
    CreditReviseStepComponent,
    CreditReviseSelectDocumentsComponent,
    CreditReviseSelectDocumentsResultComponent,
    CreditReviseCheckboxComponent,
    StepResultComponent,
    OpeningBankAccountInfoBoxesComponent,
    OpeningBankAccountInfoComponent,
    OpeningBankAccountInfoBottomSheetComponent,
    DigipayCreditReviseFeeComponent
  ],
  imports: [
    CommonModule,
    RegistrationRoutingModule,
    NgxSliderModule,
    UserInterfaceModule,
    MatDialogModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatIconModule,
    CoreModule,
  ],
  providers: [],
})
export class RegistrationModule { }
