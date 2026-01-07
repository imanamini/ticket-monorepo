import { Route } from '@angular/router';

export const walletManagementRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./features/main-wallet-management/wallet-management.component').then((c) => c.WalletManagementComponent),
  },
  {
    path: 'gift-card-qr-code-reader',
    loadComponent: () =>
      import('./components/gift-card/gift-card-qr-code-reader/qr-code-reader.component').then((c) => c.QrCodeReaderComponent),
  },
  {
    path: 'auto-cash-in',
    loadComponent: () => import('./features/auto-cash-in/auto-cash-in.component').then((c) => c.AutoCashInComponent),
  },
  {
    path: 'cashback',
    loadComponent: () => import('./features/cashback-list/cashback-list.component').then((c) => c.CashbackListComponent),
  },
];
