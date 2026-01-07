import { Route } from '@angular/router';

export const escrowConflictRoutes: Route[] = [
  {
    path: 'conflict-list/:trackingCode',
    loadComponent: () => import('./features/conflict/conflict.component').then((c) => c.ConflictComponent),
  },
];
