import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: ':fundProviderCode/:creditId',
    loadComponent: () => import('./credit-scoring-smc-step/credit-scoring-smc-step.component').then((m) => m.CreditScoringSmcStepComponent),
  },
  {
    path: 'result/:fundProviderCode/:creditId',
    loadComponent: () =>
      import('./credit-scoring-smc-result-page/credit-scoring-smc-result-page.component').then(
        (m) => m.CreditScoringSmcResultPageComponent,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreditScoringSmcStepRoutingModule {}
