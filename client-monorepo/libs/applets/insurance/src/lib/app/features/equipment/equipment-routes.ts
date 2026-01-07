import { Route } from '@angular/router';
import { EquipmentLayoutComponent } from './equipment-layout/equipment-layout.component';
import { retryImport } from '../../util/retry-import-handler';

export const EQUIPMENTS_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: '/',
    pathMatch: 'full',
  },
  {
    path: '',
    component: EquipmentLayoutComponent,
    children: [
      {
        path: 'unbundled',
        loadChildren: () => retryImport(() => import('./routes/unbundled/unbundled-routes'), 3, 500).then((m) => m.UNBUNDLED_ROUTES),
      },
      {
        path: 'digisure',
        loadChildren: () => retryImport(() => import('./routes/digisure/digisure-routes'), 3, 500).then((m) => m.DIGISURE_ROUTES),
      },
      {
        path: 'strictless',
        loadChildren: () => retryImport(() => import('./routes/strictless/strictless-routes'), 3, 500).then((m) => m.STRICTLESS_ROUTES),
      },
      {
        path: 'used',
        loadChildren: () => retryImport(() => import('./routes/used/used-routes'), 3, 500).then((m) => m.USED_ROUTES),
      },
      {
        path: 'renewal',
        loadChildren: () => retryImport(() => import('./routes/renewal/renewal-routes'), 3, 500).then((m) => m.RENEWAL_ROUTES),
      },
      {
        path: 'payment-result-loading',
        loadComponent: () =>
          retryImport(
            () => import('./routes/used/steps/used-pre-payment/partials/payment-result-loading/payment-result-loading.component'),
            3,
            500,
          ).then((c) => c.PaymentResultLoadingComponent),
      },
    ],
  },
];
