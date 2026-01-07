import { RedirectDigisureComponent } from './redirect-digisure/redirect-digisure.component';
import { Route } from '@angular/router';

export const DIGISURE_ROUTES: Route[] = [
  {
    path: 'eei/PolicyPaymentCallback',
    component: RedirectDigisureComponent
  },
  {
    path: 'EEI/PolicyPaymentCallback',
    component: RedirectDigisureComponent
  },
  {
    path: 'eei/leadview',
    children: [
      {
        path: '**',
        component: RedirectDigisureComponent
      }
    ]
  },
  {
    path: 'EEI/leadview',
    children: [
      {
        path: '**',
        component: RedirectDigisureComponent
      }
    ]
  },
];
