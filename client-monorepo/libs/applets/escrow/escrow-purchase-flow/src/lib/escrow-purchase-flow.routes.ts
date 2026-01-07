import { Route } from '@angular/router';

export const escrowPurchaseFlowRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./features/enter-amount/enter-amount.component').then((result) => result.EnterAmountComponent),
  },
  {
    path: 'order-detail',
    loadComponent: () => import('./features/order-detail/order-detail.component').then((result) => result.OrderDetailComponent),
  },
];
