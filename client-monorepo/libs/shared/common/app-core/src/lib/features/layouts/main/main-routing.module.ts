import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, campaginGuard, retryImport } from '@client-monorepo/common/network';
import { WithNavigationComponent } from '../with-navigation/with-navigation.component';
import { NoNavigationComponent } from '../no-navigation/no-navigation.component';
import { CampaignComponent } from '../../../components/campaign/campaign.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [campaginGuard],
    component: CampaignComponent,
  },
  {
    path: '',
    component: WithNavigationComponent,
    children: [
      {
        path: 'home',
        canActivate: [AuthGuard],
        loadChildren: () => retryImport(() => import('@client-monorepo/applets/home')).then((lib) => lib.homeRoutes),
        data: { animation: 'home' },
      },
      {
        path: 'transactions',
        canActivate: [AuthGuard],
        loadChildren: () => retryImport(() => import('@client-monorepo/applets/transactions')).then((c) => c.transactionRoutes),
        data: { animation: 'transactions', preload: true },
      },
      {
        path: 'hub',
        canActivate: [AuthGuard],
        loadChildren: () => retryImport(() => import('@client-monorepo/applets/hub')).then((lib) => lib.hubRoutes),
        data: { animation: 'hub', preload: true },
      },
      {
        path: 'stores',
        canActivate: [AuthGuard],
        loadChildren: () => retryImport(() => import('@client-monorepo/applets/stores')).then((lib) => lib.storesRoutes),
        data: { animation: 'stores', preload: true },
      },
      {
        path: 'profile',
        canActivate: [AuthGuard],
        loadChildren: () => retryImport(() => import('@client-monorepo/applets/profile')).then((lib) => lib.profileRoutes),
        data: { animation: 'profile', preload: true },
      },
    ],
  },
  {
    path: '',
    component: NoNavigationComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () => retryImport(() => import('@client-monorepo/applets/auth')).then((lib) => lib.authRoutes),
        data: { animation: 'auth' },
      },
      {
        path: 'service/bnpl/onboarding',
        loadChildren: () => retryImport(() => import('@client-monorepo/applets/bnpl/onboarding')).then((lib) => lib.bnplOnboardingRoutes),
        data: { animation: 'auth' },
      },
      {
        path: 'top-up',
        canActivate: [AuthGuard],
        loadChildren: () => retryImport(() => import('@client-monorepo/applets/top-up')).then((lib) => lib.topUpRoutes),
      },
      {
        path: 'internet',
        canActivate: [AuthGuard],
        loadChildren: () => retryImport(() => import('@client-monorepo/applets/internet')).then((lib) => lib.internetRoutes),
      },
      {
        path: 'payment',
        canActivate: [AuthGuard],
        loadChildren: () => retryImport(() => import('@client-monorepo/applets/payment')).then((lib) => lib.paymentRoutes),
        data: { animation: 'service' },
      },
      {
        path: 'service/c2c',
        canActivate: [AuthGuard],
        loadChildren: () => retryImport(() => import('@client-monorepo/applets/c2c')).then((lib) => lib.c2cRoutes),
      },
      {
        path: 'bill',
        canActivate: [AuthGuard],
        loadChildren: () => retryImport(() => import('@client-monorepo/applets/bill')).then((lib) => lib.billRoutes),
      },
      {
        path: 'wallet-management',
        canActivate: [AuthGuard],
        loadChildren: () =>
          retryImport(() => import('@client-monorepo/applets/wallet-management')).then((lib) => lib.walletManagementRoutes),
        data: { animation: 'service' },
      },
      {
        path: 'cash-in',
        canActivate: [AuthGuard],
        loadChildren: () => retryImport(() => import('@client-monorepo/applets/cash-in')).then((lib) => lib.cashInRoutes),
        data: { animation: 'service' },
      },
      {
        path: 'toll',
        canActivate: [AuthGuard],
        loadChildren: () => retryImport(() => import('@client-monorepo/applets/toll')).then((lib) => lib.tollRoutes),
      },
      {
        path: 'donation',
        canActivate: [AuthGuard],
        loadChildren: () => retryImport(() => import('@client-monorepo/applets/charity')).then((lib) => lib.charityRoutes),
      },
      {
        path: 'forgot-password',
        loadChildren: () => retryImport(() => import('@client-monorepo/applets/forgot-password')).then((lib) => lib.forgotPasswordRoutes),
      },
      {
        path: 'service/credit',
        canActivate: [AuthGuard],
        loadChildren: () => retryImport(() => import('@client-monorepo/applets/credit')).then((lib) => lib.creditRoutes),
        data: { animation: 'service', preload: true, critical: true },
      },
      {
        path: 'service/bnpl',
        canActivate: [AuthGuard],
        loadChildren: () => retryImport(() => import('@client-monorepo/applets/credit')).then((lib) => lib.bnplRoutes),
        data: { animation: 'service', preload: true, critical: true },
      },
      {
        path: 'pay-club',
        canActivate: [AuthGuard],
        loadChildren: () => retryImport(() => import('@client-monorepo/applets/pay-club'), 3, 500).then((m) => m.payClubRoutes),
      },
      {
        path: 'qr',
        canActivate: [AuthGuard],
        loadChildren: () => retryImport(() => import('@client-monorepo/applets/scanner')).then((lib) => lib.scannerRoutes),
      },
      {
        path: 'barcode',
        canActivate: [AuthGuard],
        loadChildren: () => retryImport(() => import('@client-monorepo/applets/barcode')).then((lib) => lib.barcodeRoutes),
      },
      {
        path: 'taxi-pay',
        canActivate: [AuthGuard],
        loadChildren: () => retryImport(() => import('@client-monorepo/applets/taxi')).then((lib) => lib.taxiRoutes),
      },
      {
        path: 'cash-out',
        canActivate: [AuthGuard],
        loadChildren: () => retryImport(() => import('@client-monorepo/applets/cash-out')).then((lib) => lib.cashOutRoutes),
        data: { animation: 'service' },
      },
      {
        path: 'offline-payment',
        canActivate: [AuthGuard],
        loadChildren: () => retryImport(() => import('@client-monorepo/applets/offline-payment')).then((lib) => lib.offlinePaymentRoutes),
        data: { animation: 'service' },
      },
      {
        path: 'fine',
        canActivate: [AuthGuard],
        loadChildren: () => retryImport(() => import('@client-monorepo/applets/fine')).then((lib) => lib.fineRoutes),
      },
      {
        path: 'subscription',
        canActivate: [AuthGuard],
        loadChildren: () => retryImport(() => import('@client-monorepo/applets/subscription')).then((lib) => lib.subscriptionRoutes),
      },
      {
        path: 'mini-app/wealth',
        canActivate: [AuthGuard],
        loadComponent: () => import('@client-monorepo/applets/wealth').then((c) => c.WealthPageComponent),
        loadChildren: () => retryImport(() => import('@client-monorepo/applets/wealth')).then((lib) => lib.wealthRoutes),
      },
      {
        path: 'mini-app/insurance',
        canActivate: [],
        loadChildren: () => retryImport(() => import('@client-monorepo/applets/insurance')).then((lib) => lib.insuranceRoutes),
      },
      {
        path: 'inbox',
        canActivate: [AuthGuard],
        loadChildren: () => retryImport(() => import('@client-monorepo/applets/inbox')).then((lib) => lib.inboxRoutes),
      },
      {
        path: 'direct-debit',
        canActivate: [AuthGuard],
        loadChildren: () => retryImport(() => import('@client-monorepo/applets/direct-debit')).then((lib) => lib.directDebitRoutes),
      },

      {
        path: 'card',
        canActivate: [AuthGuard],
        loadChildren: () => retryImport(() => import('@client-monorepo/applets/payment/digipay-card')).then((lib) => lib.DigiPayCardRoutes),
        data: { animation: 'service' },
      },
    ],
  },
  {
    path: 'service/topup',
    redirectTo: 'top-up',
  },
  {
    path: 'service/bill',
    redirectTo: 'bill',
  },
  {
    path: 'service/internet',
    redirectTo: 'internet',
  },
  {
    path: 'service/toll',
    redirectTo: 'toll',
  },
  {
    path: 'service/driving-fine',
    redirectTo: 'fine',
  },
  {
    path: 'service/donation',
    redirectTo: 'donation',
  },
  {
    path: 'service/cashin',
    redirectTo: 'cash-in',
  },
  {
    path: 'service/qr',
    redirectTo: 'qr',
  },
  {
    path: 'login/callback',
    redirectTo: 'auth/callback',
  },
  // {
  //   matcher: miniAppMatcher,
  //   component: MiniAppHandlerComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
