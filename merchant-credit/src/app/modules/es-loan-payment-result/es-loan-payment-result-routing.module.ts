import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EsLoanPaymentResultComponent } from './es-loan-payment-result.component';

const routes: Routes = [
  {
    path: '',
    component: EsLoanPaymentResultComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EsLoanPaymentResultRoutingModule {
}
