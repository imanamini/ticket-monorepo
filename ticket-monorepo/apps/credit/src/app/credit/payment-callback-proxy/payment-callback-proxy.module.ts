import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentCallbackProxyComponent } from './payment-callback-proxy/payment-callback-proxy.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {PaymentCallbackProxyRoutingModule} from "./payment-callback-proxy-routing.module";


@NgModule({
  declarations: [
    PaymentCallbackProxyComponent
  ],
  imports: [
    CommonModule,
    PaymentCallbackProxyRoutingModule,
    MatProgressSpinnerModule
  ]
})
export class PaymentCallbackProxyModule { }
