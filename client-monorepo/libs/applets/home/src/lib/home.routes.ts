import { Route } from '@angular/router';

export const homeRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./features/main-home/main-home.component').then((c) => c.MainHomeComponent),
  },
];
