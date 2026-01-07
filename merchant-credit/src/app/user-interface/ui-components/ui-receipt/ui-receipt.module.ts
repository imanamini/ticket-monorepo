import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiPaymentReceiptComponent } from './ui-payment-receipt/ui-payment-receipt.component';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgButtonModule } from '@digipay/ng-button';

@NgModule({
  declarations: [
    UiPaymentReceiptComponent
  ],
  exports: [
    UiPaymentReceiptComponent
  ],
  imports: [
    CommonModule,
    PipesModule,
    NgButtonModule
  ]
})
export class UiReceiptModule {
}
