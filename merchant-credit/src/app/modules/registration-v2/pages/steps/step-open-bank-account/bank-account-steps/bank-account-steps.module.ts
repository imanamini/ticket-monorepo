import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountRulesComponent } from './account-rules/account-rules.component';
import { AccountUploadDocumentsComponent } from './account-upload-documents/account-upload-documents.component';
import { AccountConfirmInfoComponent } from './account-confirm-info/account-confirm-info.component';
import { RegistrationUiModule } from '../../../../../../sub-modules/registration-ui/registration-ui.module';
import { UserInterfaceModule } from '../../../../../../user-interface/user-interface.module';
import { NgxButtonComponent } from '@digipay/ngx-button';

@NgModule({
  declarations: [
    AccountRulesComponent,
    AccountUploadDocumentsComponent,
    AccountConfirmInfoComponent
  ],
  exports: [
    AccountRulesComponent,
    AccountConfirmInfoComponent,
    AccountUploadDocumentsComponent
  ],
  imports: [
    CommonModule,
    RegistrationUiModule,
    UserInterfaceModule,
    NgxButtonComponent
  ]
})
export class BankAccountStepsModule {
}
