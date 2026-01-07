import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailyPaymentComponent } from './daily-payment/daily-payment.component';

@NgModule({
  declarations: [
    DailyPaymentComponent,
  ],
  exports: [
    DailyPaymentComponent,
  ],
  imports: [
    CommonModule
  ]
})
export class DirectDebitUiModule { }
