import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: ':fundProviderCode/:creditId',
    loadComponent: () => import('./credit-cheque-step/credit-cheque-step.component').then((c) => c.CreditChequeStepComponent),
  },
  {
    path: 'installment-sells/:fundProviderCode/:creditId',
    loadComponent: () =>
      import('./credit-installment-sells-step/credit-installment-sells-step.component').then((c) => c.CreditInstallmentSellsStepComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreditChequeStepRoutingModule {}
