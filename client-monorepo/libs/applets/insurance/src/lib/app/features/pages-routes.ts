import { Route } from '@angular/router';
import { retryImport } from '../util/retry-import-handler';
import { INSURANCE_APP_PREFIX } from '../data-access/constants/insurance-app-prefix.constant';

export const PAGES_ROUTES: Route[] = [
  {
    path: '',
    loadChildren: () =>
      retryImport(() => import('./insurance-wrapper/insurance-wrapper-routes'), 3, 500).then((m) => m.INSURANCE_WRAPPER_ROUTES),
  },
  {
    path: 'equipment',
    loadChildren: () => retryImport(() => import('./equipment/equipment-routes'), 3, 500).then((m) => m.EQUIPMENTS_ROUTES),
  },
  {
    path: 'application-form',
    loadChildren: () => retryImport(() => import('./floki/floki-routes'), 3, 500).then((m) => m.FLOKI_ROUTES),
  },
  {
    path: 'subscription',
    loadChildren: () => retryImport(() => import('./subscription/subscription.routes'), 3, 500).then((m) => m.SUBSCRIPTION_ROUTES),
  },
  {
    path: 'vehicle',
    loadChildren: () => retryImport(() => import('./vehicle/vehicle-routes'), 3, 500).then((m) => m.VEHICLE_ROUTES),
  },
  {
    path: 'b',
    loadChildren: () => retryImport(() => import('./provider/provider-routes'), 3, 500).then((m) => m.PROVIDER_ROUTES),
  },
  {
    path: 'resolver',
    loadComponent: () => retryImport(() => import('./resolver/resolver.component'), 3, 500).then((m) => m.ResolverComponent),
  },
  {
    path: 'journey/used',
    redirectTo: '/equipment/used?code=:code',
    pathMatch: 'full',
  },
  {
    path: INSURANCE_APP_PREFIX + '/floki',
    redirectTo: INSURANCE_APP_PREFIX + 'floki/value_device',
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
];
