import { Route } from '@angular/router';

export const taxiRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./features/taxi-main/applets-taxi.component').then((c) => c.AppletsTaxiComponent),
  },
  {
    path: 'confirm',
    loadComponent: () => import('./features/taxi-confirm/taxi-confirm.component').then((c) => c.TaxiConfirmComponent),
  },
];
