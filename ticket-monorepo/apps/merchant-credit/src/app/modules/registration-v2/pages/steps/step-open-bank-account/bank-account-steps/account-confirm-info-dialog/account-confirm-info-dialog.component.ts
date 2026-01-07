import { Component } from '@angular/core';
import { RegistrationUiModule } from '../../../../../../../sub-modules/registration-ui/registration-ui.module';
import { UserInterfaceModule } from '../../../../../../../user-interface/user-interface.module';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { SmartDialog } from '../../../../../../../user-interface/services/smart-dialog';

@Component({
  selector: 'account-confirm-info-dialog',
  standalone: true,
  imports: [
    RegistrationUiModule,
    UserInterfaceModule,
    NgxButtonComponent
  ],
  templateUrl: './account-confirm-info-dialog.component.html',
  styleUrl: './account-confirm-info-dialog.component.scss'
})
export class AccountConfirmInfoDialogComponent {

  constructor(
    private smartDialog: SmartDialog
  ) {
  }

  close() {
    this.smartDialog.close();
  }
}
