import { Routes } from '@angular/router';
import { FlokiRoutesEnum } from '../../enums/floki-routes.enum';
import { retryImport } from '../../../../util/retry-import-handler';

export const PAYMENT_ROUTES: Routes = [
  {
    path: FlokiRoutesEnum.PaymentResult,
    loadComponent: () => retryImport(() => import('./payment-result/payment-result.component'), 3, 500).then(m => m.PaymentResultComponent)
  },
  {
    path: FlokiRoutesEnum.GoToPayment,
    loadComponent: () => retryImport(() => import('./go-to-payment/go-to-payment.component'), 3, 500).then(m => m.GoToPaymentComponent)
  },
  {
    path: FlokiRoutesEnum.CheckHybrid,
    loadComponent: () => retryImport(() => import('./check-hybrid/check-hybrid.component'), 3, 500).then(m => m.CheckHybridComponent)
  }
];
