import { Route } from '@angular/router';

export const topUpRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./features/top-up-main/top-up-main.component').then((c) => c.TopUpMainComponent),
  },
  {
    path: 'confirm',
    loadComponent: () => import('./features/purchase/purchase.component').then((c) => c.TopUpPurchaseComponent),
  },
];
