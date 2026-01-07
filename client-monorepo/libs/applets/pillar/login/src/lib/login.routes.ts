import { Route } from '@angular/router';

export const loginRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./features/login/login.component').then((c) => c.LoginMainAppletComponent),
  },
  {
    path: '',
    loadComponent: () => import('./features/login/login.component').then((c) => c.LoginMainAppletComponent),
  },
];
