import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./credit-smart-scoring-step-control/credit-smart-scoring-step-control.component').then(
        (m) => m.CreditSmartScoringStepControlComponent,
      ),
    title: 'امکان‌سنجی دریافت وام',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreditSmartScoringStepRoutingModule {}
