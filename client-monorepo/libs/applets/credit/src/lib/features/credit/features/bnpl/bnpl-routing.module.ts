import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreditWrapperComponent } from '../../credit-wrapper/credit-wrapper.component';

const routes: Routes = [
  {
    path: '',
    component: CreditWrapperComponent,
    children: [
      {
        path: 'campaign',
        loadChildren: () =>
          import('./bnpl-campaign-registration/bnpl-campaign-registration-routing.module').then(
            (m) => m.BnplCampaignRegistrationRoutingModule,
          ),
      },
      {
        path: 'bnpl-subscription-register',
        loadComponent: () =>
          import('./bnpl-subscription-registration/bnpl-subscription-registration-form.component').then(
            (mod) => mod.BnplSubscriptionRegistrationFormComponent,
          ),
      },
      {
        path: 'bnpl-help',
        loadChildren: () => import('./bnpl-help/bnpl-help-routing.module').then((m) => m.BnplHelpRoutingModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BnplRoutingModule {}
