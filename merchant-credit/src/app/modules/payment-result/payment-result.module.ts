import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentResultComponent } from './payment-result/payment-result.component';
import { PaymentResultRoutingModule } from './payment-result-routing.module';
import { UserInterfaceModule } from '../../user-interface/user-interface.module';
import { NgxButtonComponent } from '@digipay/ngx-button';

@NgModule({
  declarations: [
    PaymentResultComponent
  ],
  imports: [
    CommonModule,
    UserInterfaceModule,
    PaymentResultRoutingModule,
    NgxButtonComponent
  ]
})
export class PaymentResultModule {
}
