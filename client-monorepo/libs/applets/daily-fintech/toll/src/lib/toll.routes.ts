import { Route } from '@angular/router';

export const tollRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./features/toll-home/toll-home.component').then((c) => c.TollHomeComponent),
  },
  {
    path: 'confirm',
    loadComponent: () => import('./features/toll-checkout/toll-checkout.component').then((c) => c.TollCheckoutComponent),
  },
];
