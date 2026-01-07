import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WithdrawalDetailComponent} from "./withdrawal-detail.component";
import {AuthenticateComponent} from "./authenticate/authenticate.component";
import {PrivateCellNumberPipe} from "../pipes/private-cell-number.pipe";
import {WithdrawalDetailRoutingModule} from "./withdrawal-detail-routing.module";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UserInterfaceModule} from "../../../user-interface/user-interface.module";
import {DirectDebitUiModule} from "../direct-debit-ui/direct-debit-ui.module";

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
})
export class WithdrawalDetailModule {
}
