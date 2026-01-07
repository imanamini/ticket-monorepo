import { Route } from '@angular/router';

export const escrowProfileRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./features/profile/profile.component').then((c) => c.EscrowProfileComponent),
  },
];
