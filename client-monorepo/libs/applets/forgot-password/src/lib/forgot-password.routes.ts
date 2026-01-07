import { Route } from '@angular/router';

export const forgotPasswordRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./features/forgot-password.component').then((c) => c.ForgotPasswordComponent),
  },
];
