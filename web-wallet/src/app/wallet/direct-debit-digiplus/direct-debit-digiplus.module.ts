import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DirectDebitDigiplusRoutingModule } from './direct-debit-digiplus-routing.module';
import { WalletModule } from '../wallet.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DirectDebitNavigationService } from './services/direct-debit-navigation.service';
import { FormService } from './withdrawal-detail/services/form.service';
import { HandleErrorService } from './services/handle-error.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserInterfaceModule } from '../../user-interface/user-interface.module';
import { TicketInfoService } from './services/ticket-info.service';
import { TicketService } from './services/ticket.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DirectDebitDigiplusRoutingModule,
    WalletModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    UserInterfaceModule,
  ],
  providers: [
    DirectDebitNavigationService,
    FormService,
    HandleErrorService,
    TicketInfoService,
    TicketService,
  ]
})
export class DirectDebitDigiplusModule {
}
