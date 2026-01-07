import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DirectDebitDigiplusV2RoutingModule} from "./direct-debit-digiplus-v2-routing.module";
import {WalletModule} from "../wallet.module";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {ReactiveFormsModule} from "@angular/forms";
import {UserInterfaceModule} from "../../user-interface/user-interface.module";
import {DirectDebitApiV2Service} from "../../api/direct-debit-api-v2.service";
import {HandleErrorService} from "./services/handle-error.service";
import {FormService} from "./withdrawal-detail/services/form.service";
import {TicketInfoService} from "./services/ticket-info.service";
import {TicketService} from "./services/ticket.service";
import {DirectDebitNavigationService} from "./services/direct-debit-navigation.service";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DirectDebitDigiplusV2RoutingModule,
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
    DirectDebitApiV2Service
  ]
})
export class DirectDebitDigiplusV2Module {
}
