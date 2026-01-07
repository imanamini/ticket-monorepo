import { Route } from '@angular/router';

export const cashInRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./features/main-cash-in/main-cash-in.component').then((result) => result.MainCashInComponent),
  },
];
