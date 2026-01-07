import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'resolve/:fundProviderCode/:creditId',
    loadComponent: () => import('./credit-enote-gateway/credit-enote-gateway.component').then((c) => c.CreditEnoteGatewayComponent),
  },
  {
    path: 'pay-result/:fundProviderCode/:creditId',
    loadComponent: () =>
      import('./credit-enote-step-pay-result/credit-enote-step-pay-result.component').then((c) => c.CreditEnoteStepPayResultComponent),
  },
  {
    path: 'select-note/:fundProviderCode/:creditId',
    loadComponent: () => import('./credit-select-note/credit-select-note.component').then((c) => c.CreditSelectNoteComponent),
  },
  {
    path: 'physical/:fundProviderCode/:creditId',
    loadComponent: () =>
      import('./credit-physical-enote-step/credit-physical-enote-step.component').then((c) => c.CreditPhysicalEnoteStepComponent),
  },
  {
    path: 'online/:fundProviderCode/:creditId',
    loadComponent: () => import('./credit-enote-step/credit-enote-step.component').then((c) => c.CreditEnoteStepComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreditEnoteStepRoutingModule {}
