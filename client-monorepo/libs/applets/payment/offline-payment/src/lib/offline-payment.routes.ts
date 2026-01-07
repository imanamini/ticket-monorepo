import { Route } from '@angular/router';

export const offlinePaymentRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./features/main-offline-payment/applets-offline-payment.component').then((c) => c.AppletsOfflinePaymentComponent),
  },
  {
    path: 'static',
    loadComponent: () =>
      import('./features/static-offline-payment/applets-static-offline-payment.component').then(
        (c) => c.AppletsStaticOfflinePaymentComponent,
      ),
  },
  {
    path: 'old',
    loadComponent: () => import('./features/old-offline-payment/old-offline-payment.component').then((c) => c.OldOfflinePaymentComponent),
  },
];
