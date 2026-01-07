import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EsLoanPaymentResultRoutingModule } from './es-loan-payment-result-routing.module';
import { EsLoanPaymentResultComponent } from './es-loan-payment-result.component';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { UserInterfaceModule } from '../../user-interface/user-interface.module';

@NgModule({
  declarations: [EsLoanPaymentResultComponent],
  imports: [
    CommonModule,
    EsLoanPaymentResultRoutingModule,
    NgxButtonComponent,
    UserInterfaceModule
  ]
})
export class EsLoanPaymentResultModule {
}
