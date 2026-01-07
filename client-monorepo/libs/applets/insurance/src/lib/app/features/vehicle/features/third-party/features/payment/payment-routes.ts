import { Routes } from '@angular/router';
import { ThirdPartyPageTitlesEnum } from '../../../../../../data-access/enums/third-party-page-titles.enum';
import { retryImport } from '../../../../../../util/retry-import-handler';

export const PAYMENT_ROUTES: Routes = [
  {
    path: 'result',
    data: {title: ThirdPartyPageTitlesEnum.PaymentResult},
    loadComponent: () => retryImport(() => import('./features/payment-result/payment-result.component'), 3, 500).then(m => m.PaymentResultComponent)
  },
  {
    path: 'go-to-payment',
    data: {title: ThirdPartyPageTitlesEnum.PaymentGoToPayment},
    loadComponent: () => retryImport(() => import('./features/go-to-payment/go-to-payment.component'), 3, 500).then(m => m.GoToPaymentComponent)
  },
  {
    path: 'check-hybrid',
    data: {title: ThirdPartyPageTitlesEnum.PaymentCheckHybrid},
    loadComponent: () => retryImport(() => import('./features/check-hybrid/check-hybrid.component'), 3, 500).then(m => m.CheckHybridComponent)
  }
];
