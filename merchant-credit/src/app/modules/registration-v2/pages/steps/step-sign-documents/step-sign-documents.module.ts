import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StepSignDocumentsRoutingModule } from './step-sign-documents-routing.module';
import { SignDocumentsComponent } from './sign-documents/sign-documents.component';
import { RegistrationUiModule } from '../../../../../sub-modules/registration-ui/registration-ui.module';
import { UserInterfaceModule } from '../../../../../user-interface/user-interface.module';
import { UiViewersModule } from '../../../../../user-interface/ui-components/ui-viewers/ui-viewers.module';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { NgButtonModule } from '@digipay/ng-button';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';

@NgModule({
  declarations: [
    SignDocumentsComponent
  ],
  imports: [
    CommonModule,
    StepSignDocumentsRoutingModule,
    RegistrationUiModule,
    UserInterfaceModule,
    UiViewersModule,
    ApiImageModule,
    NgButtonModule,
    NgxStatusResultModule
  ]
})
export class StepSignDocumentsModule {
}
