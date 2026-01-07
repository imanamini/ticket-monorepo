import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicLandingsComponent } from '../dynamic-landings/dynamic-landings.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./merchant-organization-registration-event/merchant-organization-registration-event.component').then(
        (m) => m.MerchantOrganizationRegistrationEventComponent,
      ),
  },
  {
    path: 'merchant-organization-registration-r-event',
    pathMatch: 'full',
    loadComponent: () =>
      import('./merchant-organization-registration-event/merchant-organization-registration-event.component').then(
        (m) => m.MerchantOrganizationRegistrationEventComponent,
      ),
  },
  {
    path: 'allocationdp-nobitex',
    pathMatch: 'full',
    loadComponent: () => import('./allocation-dp-nobitex/allocation-dp-nobitex.component').then((m) => m.AllocationDpNobitexComponent),
  },
  {
    path: 'bnpl-onboarding',
    pathMatch: 'full',
    loadComponent: () => import('./landing-onboarding/onboarding.component').then((m) => m.OnboardingComponent),
  },
  {
    path: 'tapsi-cab',
    pathMatch: 'full',
    loadComponent: () => import('./tapsi-cab/tapsi-cab/tapsi-cab.component').then((m) => m.TapsiCabComponent),
  },

  {
    path: 'black-friday',
    pathMatch: 'full',
    loadComponent: () => import('./black-friday/blackFriday.component').then((m) => m.BlackFridayComponent),
  },

  {
    path: ':slug',
    pathMatch: 'full',
    component: DynamicLandingsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StaticLandingsRoutingModule {}
