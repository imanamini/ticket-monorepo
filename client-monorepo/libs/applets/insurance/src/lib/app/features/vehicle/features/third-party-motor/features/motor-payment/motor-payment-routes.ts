import { Routes } from '@angular/router';
import { ThirdPartyPageTitlesEnum } from '../../../../../../data-access/enums/third-party-page-titles.enum';
import { retryImport } from '../../../../../../util/retry-import-handler';

export const MOTOR_PAYMENT_ROUTES: Routes = [
  {
    path: 'result',
    data: {title: ThirdPartyPageTitlesEnum.PaymentResult},
    loadComponent: () => retryImport(() => import('./motor-payment-result/motor-payment-result.component'), 3, 500).then(m => m.MotorPaymentResultComponent)
  },
  {
    path: 'go-to-payment',
    data: {title: ThirdPartyPageTitlesEnum.PaymentGoToPayment},
    loadComponent: () => retryImport(() => import('./motor-go-to-payment/motor-go-to-payment.component'), 3, 500).then(m => m.MotorGoToPaymentComponent)
  },
  {
    path: 'check-hybrid',
    data: {title: ThirdPartyPageTitlesEnum.PaymentCheckHybrid},
    loadComponent: () => retryImport(() => import('./motor-check-hybrid/motor-check-hybrid.component'), 3, 500).then(m => m.MotorCheckHybridComponent)
  }
];
