import { Route } from '@angular/router';

export const internetRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./features/internet-main/internet-main.component').then((c) => c.InternetMainComponent),
  },
  {
    path: 'purchase',
    loadComponent: () => import('./features/purchase/purchase.component').then((c) => c.PurchaseComponent),
  },
  {
    path: 'confirm',
    loadComponent: () => import('./features/confirm/confirm.component').then((c) => c.ConfirmComponent),
  },
];
