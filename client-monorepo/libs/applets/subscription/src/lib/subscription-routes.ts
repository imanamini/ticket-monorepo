import { Route } from '@angular/router';

export const subscriptionRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./features/plans-list/plans-list.component').then((c) => c.PlansListComponent),
  },
  {
    path: 'enter',
    loadComponent: () => import('./features/entrance/entrance.component').then((c) => c.EntranceComponent),
  },
  {
    path: 'subscription-management',
    loadComponent: () =>
      import('./features/subscription-management/subscription-management.component').then((c) => c.SubscriptionManagementComponent),
  },
  {
    path: 'refund',
    loadComponent: () => import('./features/refund-result-page/refund-result-page.component').then((c) => c.RefundResultPageComponent),
  },
  {
    path: 'transaction-status/:uuid',
    loadComponent: () => import('./features/transaction-status/transaction-status.component').then((c) => c.TransactionStatusComponent),
  },
];
