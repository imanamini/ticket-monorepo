import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EsLoanComponent } from './es-loan.component';
import { EsLoanDashboardComponent } from './pages/es-loan-dashboard/es-loan-dashboard.component';
import {
  EsLoanUnderConstructionComponent
} from './components/es-loan-under-construction/es-loan-under-construction.component';

const routes: Routes = [
  {
    path: ':ticket',
    component: EsLoanComponent,
    children: [
      {
        path: 'home',
        component: EsLoanDashboardComponent,
      },
      {
        path: 'under-construction',
        component: EsLoanUnderConstructionComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EsLoanRoutingModule {
}
