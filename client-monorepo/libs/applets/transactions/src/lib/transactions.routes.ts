import { Route } from '@angular/router';

export const transactionRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((c) => c.HomeComponent),
  },
  {
    path: 'report/:mode',
    loadComponent: () => import('./features/transactions/transactions.component').then((c) => c.TransactionsComponent),
  },
];
