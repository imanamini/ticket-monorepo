import { Route } from '@angular/router';
import { retryImport } from '../../../../util/retry-import-handler';

export const PAYMENT_ROUTES: Route[] = [
  {
    path: 'result',
    loadComponent: () => retryImport(() => import('./payment-result/payment-result.component'), 3, 500).then(c => c.PaymentResultComponent),
  },
  {
    path: 'check-hybrid',
    loadComponent: () => retryImport(() => import('./check-hybrid/check-hybrid.component'), 3, 500).then(c => c.CheckHybridComponent)
  },
  {
    path: 'go-to-payment',
    loadComponent: () => retryImport(() => import('./go-to-payment/go-to-payment.component'), 3, 500).then(c => c.GoToPaymentComponent)
  }
];
