import { Route } from '@angular/router';

export const escrowPluginRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./features/plugin-activation/plugin-activation.component').then((c) => c.PluginActivationComponent),
  },
  {
    path: 'success',
    loadComponent: () => import('./features/plugin-success/plugin-success.component').then((c) => c.PluginSuccessComponent),
  },
];
