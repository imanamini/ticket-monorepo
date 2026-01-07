import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { Route } from '@angular/router';
import { retryImport } from './util/retry-import-handler';

export const APP_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => retryImport(() => import('./features/insurance-wrapper/insurance-wrapper.component'), 3, 500).then((c) => c.InsuranceWrapperComponent),
    loadChildren: () =>
      retryImport(() => import('./features/insurance-wrapper/insurance-wrapper-routes'), 3, 500).then((m) => m.INSURANCE_WRAPPER_ROUTES),
  },
  {
    path: 'equipment',
    loadChildren: () => retryImport(() => import('./features/equipment/equipment-routes'), 3, 500).then((m) => m.EQUIPMENTS_ROUTES),
  },
  {
    path: 'application-form',
    loadChildren: () => retryImport(() => import('./features/floki/floki-routes'), 3, 500).then((m) => m.FLOKI_ROUTES),
  },
  {
    path: 'subscription',
    loadChildren: () => retryImport(() => import('./features/subscription/subscription.routes'), 3, 500).then((m) => m.SUBSCRIPTION_ROUTES),
  },
  {
    path: 'vehicle',
    loadChildren: () => retryImport(() => import('./features/vehicle/vehicle-routes'), 3, 500).then((m) => m.VEHICLE_ROUTES),
  },
  {
    path: 'b',
    loadChildren: () => retryImport(() => import('./features/provider/provider-routes'), 3, 500).then((m) => m.PROVIDER_ROUTES),
  },
  {
    path: 'resolver',
    loadComponent: () => retryImport(() => import('./features/resolver/resolver.component'), 3, 500).then((m) => m.ResolverComponent),
  },
  {
    path: 'journey/used',
    redirectTo: '/equipment/used?code=:code',
    pathMatch: 'full',
  },
  {
    path: 'mini-app/insurance/floki',
    redirectTo: '/mini-app/insurance/floki/value_device',
    pathMatch: 'full',
  },
  {
    path: 'journey/renewal',
    redirectTo: '/equipment/renewal?code=:code',
    pathMatch: 'full',
  },
  {
    path: 'unbundled/home',
    redirectTo: '/equipment/unbundled/home?code=:code',
    pathMatch: 'full',
  },
  {
    path: 'digisure',
    redirectTo: '/equipment/digisure',
    pathMatch: 'full',
  },
  {
    path: 'strictless',
    redirectTo: '/equipment/strictless',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: NotFoundPageComponent,
  },
];
