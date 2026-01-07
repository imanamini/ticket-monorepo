import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreditComponent } from './credit.component';
import { ErrorComponent } from './error/error.component';
import { CreditHomeComponent } from './credit-home/credit-home.component';
import { PayAmountComponent } from './pay/pay-flow/pay-amount.component';
import { CancelAndGoBackComponent } from './cancel-and-go-back/cancel-and-go-back.component';
import { NeoPayDetailsComponent } from './pay/neo-pay-details/neo-pay-details.component';
import { CardPayFlowComponent } from './pay/card-pay-flow/card-pay-flow.component';

const routes: Routes = [
  {
    path: '',
    component: CreditHomeComponent,
    canActivate: [],
  },
  {
    path: 'ticket/:ticket',
    component: CreditComponent,
    children: [
      {
        path: 'pay',
        component: PayAmountComponent,
      },
    ]
  },
  {
    path: 'pay/:payType/details/:ticket/:fundProviderBusinessId',
    component: NeoPayDetailsComponent
  },
  {
    path: 'pay/:payType/details/:ticket/:fundProviderBusinessId/:creditId',
    component: NeoPayDetailsComponent,
  },
  {
    path: 'card-pay/:ticket',
    component: CardPayFlowComponent
  },

  // ------------------------------------------------
  {
    path: 'error',
    component: ErrorComponent,
    canActivate: [],
  },
  {
    path: 'cancel',
    component: CancelAndGoBackComponent,
    canActivate: [],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditRoutingModule {
}
