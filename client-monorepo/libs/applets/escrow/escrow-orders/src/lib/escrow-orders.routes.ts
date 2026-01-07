import { Route } from '@angular/router';

export const escrowOrdersRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./features/orders/orders.component').then((c) => c.OrdersComponent),
  },
];
