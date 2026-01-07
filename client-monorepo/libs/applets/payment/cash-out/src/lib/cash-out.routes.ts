import { Route } from '@angular/router';
import { CashOutLayoutComponent } from './features/cash-out-layout/cash-out-layout.component';

export const cashOutRoutes: Route[] = [
  {
    path: '',
    component: CashOutLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/main-cash-out/cash-out.component').then((result) => result.MainCashOutComponent),
      },
      {
        path: 'card/choose-card',
        loadComponent: () =>
          import('./components/cash-out-choose-card/cash-out-choose-card.component').then((result) => result.CashOutChooseCardComponent)
      },
      {
        path: 'card/add-card',
        loadComponent: () =>
          import('./components/cash-out-add-card/cash-out-add-card.component').then((result) => result.CashOutAddCardComponent)
      },
    ]
  },
  {
    path: 'wallet-amount',
    loadComponent: () =>
      import('./components/wallet-transfer-module/wallet-amount/wallet-amount.component').then((result) => result.WalletAmountComponent),
  },
  {
    path: 'wallet/pay',
    loadComponent: () =>
      import('./components/wallet-transfer-module/wallet-pay/wallet-pay.component').then((result) => result.WalletPayComponent),
  },
  {
    path: 'verification',
    loadComponent: () =>
      import('./components/wallet-transfer-module/verification-confirmation/verification-confirmation.component').then(
        (result) => result.VerificationConfirmationComponent,
      ),
  },
  {
    path: 'verify-otp',
    loadComponent: () =>
      import('./components/wallet-transfer-module/enter-otp/enter-otp.component').then((result) => result.EnterOtpComponent),
  },
  {
    path: 'receipt',
    loadComponent: () => import('./components/receipt/cash-out-receipt.component').then((result) => result.CashOutReceiptComponent),
  },

  {
    path: 'transfer',
    loadComponent: () => import('./features/main-cash-out/cash-out.component').then((result) => result.MainCashOutComponent),
  },
  {
    path: "**",
    redirectTo: "",
  },
];
