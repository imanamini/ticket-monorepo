import { Route } from '@angular/router';
import { HouseIncidentsPageTitleEnum } from '../../data-access/enums/house-incidents-page-title.enum';
import { retryImport } from '../../util/retry-import-handler';

export const HOUSE_INCIDENTS_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => retryImport(() => import('./house-incidents.component'), 3, 500).then(m => m.HouseIncidentsComponent),
    children: [
      {
        path: '',
        loadComponent: () => retryImport(() => import('./features/plp/plp.component'), 3, 500).then(m => m.PlpComponent),
        data: { title: HouseIncidentsPageTitleEnum.HOUSE_INCIDENTS_PLP },
      },
      {
        path: 'checkout',
        loadComponent: () => retryImport(() => import('./features/checkout/checkout.component'), 3, 500).then(m => m.CheckoutComponent),
        data: { title: HouseIncidentsPageTitleEnum.HOUSE_INCIDENTS_CHECKOUT },
      },
      {
        path: 'payment',
        loadChildren: () => retryImport(() => import('./features/payment/payment-routes'), 3, 500).then(m => m.PAYMENT_ROUTES),
        data: { title: HouseIncidentsPageTitleEnum.PAYMENT_RESULT },
      },
      {
        path: 'complete-info',
        loadComponent: () => retryImport(() => import('./features/complete-info/complete-info.component'), 3, 500).then(m => m.CompleteInfoComponent),
        data: { title: HouseIncidentsPageTitleEnum.COMPLETE_INFO }
      },
      {
        path: 'complete-journey',
        loadComponent: () => retryImport(() => import('./features/complete-journey/complete-journey.component'), 3, 500).then(m => m.CompleteJourneyComponent),
        data: { title: HouseIncidentsPageTitleEnum.COMPLETE_JOURNEY }
      }
    ]
  },
  {
    path: 'plp',
    redirectTo: '',
    pathMatch: 'full'
  }
];
