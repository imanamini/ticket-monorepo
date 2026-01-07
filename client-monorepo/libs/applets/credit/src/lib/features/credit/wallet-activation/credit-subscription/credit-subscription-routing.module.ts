import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: ':fundProviderCode/:creditId',
    loadComponent: () => import('./credit-subscription.component').then(
      c => c.CreditSubscriptionComponent
    ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreditSubscriptionRoutingModule {}
