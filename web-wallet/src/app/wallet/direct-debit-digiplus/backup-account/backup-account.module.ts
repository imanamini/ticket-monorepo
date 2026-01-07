import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackupAccountRoutingModule } from './backup-account-routing.module';
import { BackupAccountComponent } from './backup-account.component';
import { UserInterfaceModule } from '../../../user-interface/user-interface.module';
import { WithdrawalConfirmationComponent } from './withdrawal-confirmation/withdrawal-confirmation.component';
import { DirectDebitUiModule } from '../direct-debit-ui/direct-debit-ui.module';

@NgModule({
  declarations: [BackupAccountComponent, WithdrawalConfirmationComponent],
  imports: [
    CommonModule,
    BackupAccountRoutingModule,
    UserInterfaceModule,
    DirectDebitUiModule,
  ]
})
export class BackupAccountModule { }
