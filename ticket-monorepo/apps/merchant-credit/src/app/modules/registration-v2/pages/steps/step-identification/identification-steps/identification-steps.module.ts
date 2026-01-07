import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepBasicInfoComponent } from './step-basic-info/step-basic-info.component';
import { StepAddressComponent } from './step-address/step-address.component';
import { StepRecordVideoComponent } from './step-record-video/step-record-video.component';
import { RegistrationUiModule } from '../../../../../../sub-modules/registration-ui/registration-ui.module';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { UiNoteModule } from '../../../../../../user-interface/ui-components/ui-note/ui-note.module';
import { StepIdentificationComponent } from './step-identification/step-identification.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserInterfaceModule } from '../../../../../../user-interface/user-interface.module';
import { StepOtpComponent } from './step-otp/step-otp.component';
import {
  AddressConfirmationDialogComponent
} from './step-address/address-confirmation-dialog/address-confirmation-dialog.component';
import { NgButtonModule } from '@digipay/ng-button';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { BasicInfoCardComponent } from './basic-info-card/basic-info-card.component';
import { ApiImageModule } from '@digipay/ng-ui-api-image';

@NgModule({
  declarations: [
    StepBasicInfoComponent,
    StepAddressComponent,
    StepRecordVideoComponent,
    StepIdentificationComponent,
    StepOtpComponent,
    AddressConfirmationDialogComponent,
    BasicInfoCardComponent,
  ],
  exports: [
    StepBasicInfoComponent,
    StepAddressComponent,
    StepRecordVideoComponent,
    StepIdentificationComponent,
    StepOtpComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RegistrationUiModule,
    UiFormFieldBuilderModule,
    UiNoteModule,
    UserInterfaceModule,
    NgButtonModule,
    NgxStatusResultModule,
    ApiImageModule
  ]
})
export class IdentificationStepsModule {
}
