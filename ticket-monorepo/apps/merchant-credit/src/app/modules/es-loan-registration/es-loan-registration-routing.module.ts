import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  EsLoanRegistrationOverviewComponent
} from './pages/es-loan-registration-overview/es-loan-registration-overview.component';
import { EsLoanRegistrationComponent } from './es-loan-registration.component';
import {
  EsLoanRegistrationStepsComponent
} from './pages/es-loan-registration-steps';

const routes: Routes = [
  {
    path: '',
    component: EsLoanRegistrationComponent,
    children: [
      {
        path: 'overview',
        component: EsLoanRegistrationOverviewComponent
      },
      {
        path: ':creditId',
        component: EsLoanRegistrationStepsComponent
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EsLoanRegistrationRoutingModule {
}
