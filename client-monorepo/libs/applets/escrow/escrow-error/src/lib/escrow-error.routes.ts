import { Route } from '@angular/router';

export const escrowErrorRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./features/error/error.component').then((c) => c.ErrorComponent),
  },
];
