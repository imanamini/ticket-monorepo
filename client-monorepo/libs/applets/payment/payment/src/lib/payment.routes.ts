import { Route } from '@angular/router';
import { retryImport } from '@client-monorepo/common/network';

export const paymentRoutes: Route[] = [
  {
    path: 'result/:transactionType',
    loadComponent: () =>
      retryImport(() => import('./features/payment-callback/payment-callback.component')).then((c) => c.PaymentCallbackComponent),
  },
  {
    path: 'transaction-result/:activityId',
    loadComponent: () => import('./features/transaction-result/transaction-result.component').then((c) => c.TransactionResultComponent),
  },
  {
    path: 'wallet/pay',
    loadComponent: () => import('./features/wallet-pay/wallet-pay.component').then((c) => c.WalletPayComponent),
  },
  {
    path: 'dpg/pay',
    loadComponent: () => import('./features/dpg-pay/dpg-pay.component').then((c) => c.DpgPayComponent),
  },
  {
    path: 'verification/confirm',
    loadComponent: () =>
      import('./features/verification-confirmation/verification-confirmation.component').then((c) => c.VerificationConfirmationComponent),
  },
  {
    path: 'verification/otp',
    loadComponent: () => import('./features/verification-otp/verification-otp.component').then((c) => c.VerificationOtpComponent),
  },
];
