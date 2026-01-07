import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EsLoanRepaymentComponent } from './es-loan-repayment.component';
import { EsLoanRepaymentListComponent } from './pages/es-loan-repayment-list/es-loan-repayment-list.component';
import { EsLoanRepaymentDetailComponent } from './pages/es-loan-repayment-detail/es-loan-repayment-detail.component';

const routes: Routes = [
  {
    path: '',
    component: EsLoanRepaymentComponent,
    children: [
      {
        path: 'list',
        component: EsLoanRepaymentListComponent
      },
      {
        path: 'detail/:id',
        component: EsLoanRepaymentDetailComponent
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EsLoanRepaymentRoutingModule {
}
