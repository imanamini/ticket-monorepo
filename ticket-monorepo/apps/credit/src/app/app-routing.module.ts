import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreditRootComponent } from './credit/credit-root/credit-root.component';
import { BnplPayRootComponent } from './credit/module/bnpl-pay/bnpl-pay-root/bnpl-pay-root.component';

const routes: Routes = [
  {
    path: '',
    component: CreditRootComponent,
    loadChildren: () => import('./credit/module/credit.module').then(m => m.CreditModule)
  },
  {
    path: 'purchase',
    component: CreditRootComponent,
    loadChildren: () => import('./credit/pay-separately/pay-separately.module').then(m => m.PaySeparatelyModule)
  },
  {
    path: 'bnpl',
    loadChildren: () => import('./credit/module/bnpl/bnpl.module').then(m => m.BnplModule)
  },
  {
    path: 'bnpl-pay',
    component: BnplPayRootComponent,
    loadChildren: () => import('./credit/module/bnpl-pay/bnpl-pay.module').then(m => m.BnplPayModule)
  },
  {
    path: 'payment-callback-proxy',
    loadChildren: () => import('./credit/payment-callback-proxy/payment-callback-proxy.module').then(m => m.PaymentCallbackProxyModule)
  },
  {
    path: 'digital-sign-redirection',
    loadChildren: () => import('./credit/digital-sign-redirection/digital-sign-redirection.module').then(m => m.DigitalSignRedirectionModule)
  },
  {
    path: 'ipl',
    loadChildren: () => import('./credit/installment-pay-link/ipl.module').then(m => m.IplModule)
  },
  {
    path: 'pay-receipt',
    component: CreditRootComponent,
    loadComponent: () => import('./credit/payment-receipt/payment-receipt.component').then(m => m.PaymentReceiptComponent)
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
