import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PaymentCallbackProxyComponent} from './payment-callback-proxy/payment-callback-proxy.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentCallbackProxyComponent,
    canActivate: [],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentCallbackProxyRoutingModule {
}
