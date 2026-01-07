import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./bnpl-landing/bnpl-landing.component').then((c) => c.BnplLandingComponent),
  },
  {
    path: 'activation',
    loadComponent: () => import('./bnpl-registration-form/bnpl-registration-form.component').then((c) => c.BnplRegistrationFormComponent),
  },
  {
    path: 'error/:errorType',
    loadComponent: () => import('./bnpl-error-page/bnpl-error-page.component').then((c) => c.BnplErrorPageComponent),
  },
  {
    path: 'scoring-failed',
    loadComponent: () =>
      import('./bnpl-failed-scoring-page/bnpl-failed-scoring-page.component').then((c) => c.BnplFailedScoringPageComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BnplCampaignRegistrationRoutingModule {}
