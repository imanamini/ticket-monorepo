import { Route } from '@angular/router';
import { MainComponent, NoNavigationComponent, WithNavigationComponent } from '@client-monorepo/app-core';
import { digikalaAuthResolver } from './data-access/resolvers/digikala-auth.resolver';
import { authRedirectGuard } from './data-access/guards/auth-redirect.guard';
import { installmentsOverviewRoute } from './routes/installments-overview.route';
import { retryImport } from '@client-monorepo/common/network';

export const appRoutes: Route[] = [
  {
    path: '',
    component: MainComponent,
    resolve: { auth: digikalaAuthResolver },
    children: [
      {
        path: '',
        component: WithNavigationComponent,
        canActivate: [authRedirectGuard],
        children: [
          {
            path: 'home',
            canActivate: [authRedirectGuard],
            loadChildren: () => retryImport(() => import('@client-monorepo/applets/pillar/home')).then((lib) => lib.homeRoutes),
            data: { animation: 'home', preload: true, critical: true },
          },
          {
            path: 'transactions',
            canActivate: [authRedirectGuard],
            loadChildren: () => retryImport(() => import('@client-monorepo/applets/transactions')).then((c) => c.transactionRoutes),
            data: { animation: 'transactions', preload: true, critical: true },
          },
          {
            path: 'transactions',
            pathMatch: 'full',
            redirectTo: 'transactions/report/history',
          },
          {
            path: 'profile',
            canActivate: [authRedirectGuard],
            loadChildren: () => retryImport(() => import('@client-monorepo/applets/profile')).then((lib) => lib.profileRoutes),
            data: { animation: 'profile', preload: true, critical: true },
          },
          installmentsOverviewRoute,
        ],
      },
      {
        path: '',
        component: NoNavigationComponent,
        children: [
          {
            path: 'auth',
            canActivate: [authRedirectGuard],
            loadChildren: () => retryImport(() => import('@client-monorepo/applets/pillar/login')).then((lib) => lib.loginRoutes),
            data: { animation: 'auth', preload: true, critical: true },
          },
          {
            path: 'wallet-management',
            canActivate: [authRedirectGuard],
            loadChildren: () =>
              retryImport(() => import('@client-monorepo/applets/wallet-management')).then((lib) => lib.walletManagementRoutes),
            data: { animation: 'service', preload: true, critical: true },
          },
          {
            path: 'cash-in',
            canActivate: [authRedirectGuard],
            loadChildren: () => retryImport(() => import('@client-monorepo/applets/cash-in')).then((lib) => lib.cashInRoutes),
          },
          {
            path: 'service/credit',
            canActivate: [authRedirectGuard],
            loadChildren: () => retryImport(() => import('@client-monorepo/applets/credit')).then((lib) => lib.creditRoutes),
            data: { animation: 'service', preload: true, critical: true },
          },
          {
            path: 'service/bnpl',
            canActivate: [authRedirectGuard],
            loadChildren: () => retryImport(() => import('@client-monorepo/applets/credit')).then((lib) => lib.bnplRoutes),
            data: { animation: 'service', preload: true, critical: true },
          },
          {
            path: 'cash-out',
            canActivate: [authRedirectGuard],
            loadChildren: () => retryImport(() => import('@client-monorepo/applets/cash-out')).then((lib) => lib.cashOutRoutes),
          },
          {
            path: 'offline-payment',
            canActivate: [authRedirectGuard],
            loadChildren: () =>
              retryImport(() => import('@client-monorepo/applets/offline-payment')).then((lib) => lib.offlinePaymentRoutes),
          },
          {
            path: 'subscription',
            canActivate: [authRedirectGuard],
            loadChildren: () => retryImport(() => import('@client-monorepo/applets/subscription')).then((lib) => lib.subscriptionRoutes),
          },
          {
            path: 'payment',
            canActivate: [authRedirectGuard],
            loadChildren: () => retryImport(() => import('@client-monorepo/applets/payment')).then((lib) => lib.paymentRoutes),
          },
          {
            path: 'mini-app/insurance',
            canActivate: [authRedirectGuard],
            loadChildren: () => retryImport(() => import('@client-monorepo/applets/insurance')).then((lib) => lib.insuranceRoutes),
          },
        ],
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
