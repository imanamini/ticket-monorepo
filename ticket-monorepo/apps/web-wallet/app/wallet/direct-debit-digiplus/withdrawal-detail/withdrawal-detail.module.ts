import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WithdrawalDetailRoutingModule } from './withdrawal-detail-routing.module';
import { WithdrawalDetailComponent } from './withdrawal-detail.component';
import { AuthenticateComponent } from './authenticate/authenticate.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserInterfaceModule } from '../../../user-interface/user-interface.module';
import { PrivateCellNumberPipe } from '../pipes/private-cell-number.pipe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DirectDebitUiModule } from '../direct-debit-ui/direct-debit-ui.module';
import { DirectDebitNavigationService } from '../services/direct-debit-navigation.service';
import { TicketService } from '../services/ticket.service';
import { TicketInfoService } from '../services/ticket-info.service';

@NgModule({
  declarations: [
    WithdrawalDetailComponent,
    AuthenticateComponent,
    PrivateCellNumberPipe
  ],
  imports: [
    CommonModule,
    WithdrawalDetailRoutingModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    FormsModule,
    UserInterfaceModule,
    DirectDebitUiModule,
  ],
  providers: [
    TicketService,
    TicketInfoService,
    DirectDebitNavigationService]
})
export class WithdrawalDetailModule {
}
