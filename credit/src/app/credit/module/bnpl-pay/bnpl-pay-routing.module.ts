import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BnplPayFlowComponent } from './bnpl-pay-flow/bnpl-pay-flow.component';
import { BnplPayDetailsComponent } from './bnpl-pay-details/bnpl-pay-details.component';

const routes: Routes = [
  {
    path: ':ticket',
    component: BnplPayFlowComponent,
  },
  {
    path: 'details/:ticket/:fundProviderBusinessId/:creditId',
    component: BnplPayDetailsComponent
  },
  {
    path: 'details/:ticket/:fundProviderBusinessId/:creditId/:couponCode',
    component: BnplPayDetailsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BnplPayRoutingModule {
}
