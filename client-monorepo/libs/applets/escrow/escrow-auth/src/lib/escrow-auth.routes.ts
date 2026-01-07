import { Route } from '@angular/router';

export const escrowAuthRoutes: Route[] = [
  {
    path: 'login',
    loadComponent: () => import('./features/escrow-auth/escrow-auth.component').then((c) => c.EscrowAuthComponent),
  },
  {
    path: 'rules',
    loadComponent: () => import('./features/escrow-rules/escrow-rules.component').then((c) => c.EscrowRulesComponent),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
];
