import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'activation',
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule),
  },
  {
    path: 'es-loan',
    loadChildren: () => import('./modules/es-loan/es-loan.module').then(m => m.EsLoanModule),
  },
  {
    path: 'es-loan-payment-result',
    loadChildren: () => import('./modules/es-loan-payment-result/es-loan-payment-result.module').then(m => m.EsLoanPaymentResultModule),
  },
  {
    path: 'es-loan-registration',
    loadChildren: () => import('./modules/es-loan-registration/es-loan-registration.module').then(m => m.EsLoanRegistrationModule),
  },
  {
    path: 'es-loan-repayment',
    loadChildren: () => import('./modules/es-loan-repayment/es-loan-repayment.module').then(m => m.EsLoanRepaymentModule),
  },
  {
    path: 'rules-selection',
    loadChildren: () => import('./modules/rules-selection/rules-selection.module').then(m => m.RulesSelectionModule),
  },
  {
    path: 'registration',
    loadChildren: () => import('./modules/registration/registration.module').then(m => m.RegistrationModule),
  },
  {
    path: 'registration-v2',
    loadChildren: () => import('./modules/registration-v2/registration-v2.module').then(m => m.RegistrationV2Module),
  },
  {
    path: 'registration-v3',
    loadChildren: () => import('./modules/registration-v3/registration-v3.module').then(m => m.RegistrationV3Module),
  },
  {
    path: 'early-settlement',
    loadChildren: () => import('./modules/early-settlement/early-settlement.module').then(m => m.EarlySettlementModule),
  },
  {
    path: 'payment-result',
    loadChildren: () => import('./modules/payment-result/payment-result.module').then(m => m.PaymentResultModule),
  },
  {
    path: 'no-ticket',
    loadChildren: () => import('./modules/no-ticket/no-ticket.module').then(m => m.NoTicketModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
