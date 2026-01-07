import { Route } from '@angular/router';
import { ThirdPartyRoutesEnum } from './data-access/enums/third-party-routes.enum';
import { ThirdPartyPageTitlesEnum } from '../../../../data-access/enums/third-party-page-titles.enum';
import { retryImport } from '../../../../util/retry-import-handler';

export const THIRD_PARTY_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => retryImport(() => import('./third-party.component'), 3, 500).then(m => m.ThirdPartyComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        data: {title: ThirdPartyPageTitlesEnum.Plate},
        loadComponent: () => retryImport(() => import('./features/plate/plate.component'), 3, 500).then(c => c.PlateComponent),
      },
      {
        path: ThirdPartyRoutesEnum.Sanhab,
        loadChildren: () => retryImport(() => import('./features/sanhab/sanhab-routes'), 3, 500).then(m => m.SANHAB_ROUTES)
      },
      {
        path: ThirdPartyRoutesEnum.PriceCardList,
        loadChildren: () => retryImport(() => import('./features/price-card-list/price-card-list-routes'), 3, 500).then(m => m.INSURERS_ROUTES)
      },
      {
        path: ThirdPartyRoutesEnum.CarInfo,
        loadChildren: () => retryImport(() => import('./features/car-info/car-info-routes'), 3, 500).then(m => m.CAR_INFO_ROUTES),
      },
      {
        path: ThirdPartyRoutesEnum.Order,
        loadChildren: () => retryImport(() => import('./features/order/order-routes'), 3, 500).then(m => m.ORDER_ROUTES)
      },
      {
        path: ThirdPartyRoutesEnum.Payment,
        loadChildren: () => retryImport(() => import('./features/payment/payment-routes'), 3, 500).then(m => m.PAYMENT_ROUTES)
      }
    ]
  }
];
