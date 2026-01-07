import { Route } from '@angular/router';

export const homeRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((c) => c.HomeMainAppletComponent),
  },
];
