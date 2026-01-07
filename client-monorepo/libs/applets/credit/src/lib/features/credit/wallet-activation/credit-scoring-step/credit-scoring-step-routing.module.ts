import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'v2/:fundProviderCode/:creditId',
    loadComponent: () =>
      import('./credit-scoring-step-control/credit-scoring-step-control.component').then((m) => m.CreditScoringStepControlComponent),
    title: 'امکان‌سنجی دریافت وام',
  },
  {
    path: 'result/:fundProviderCode/:creditId',
    loadComponent: () =>
      import('./credit-scoring-step-result/credit-scoring-step-result.component').then((m) => m.CreditScoringStepResultComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreditScoringStepRoutingModule {}
