import { Route } from '@angular/router';

export const escrowHomeRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((c) => c.HomeComponent),
  },
];
