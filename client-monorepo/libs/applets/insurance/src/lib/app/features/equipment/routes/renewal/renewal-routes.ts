import { RenewalLayoutComponent } from './renewal-layout/renewal-layout.component';
import { Route } from '@angular/router';
import { retryImport } from '../../../../util/retry-import-handler';

export const RENEWAL_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => retryImport(() => import('./renewal-layout/renewal-layout.component'), 3, 500)
      .then(c => c.RenewalLayoutComponent)
  },
  {
    path: 'payment-result',
    redirectTo: '',
    pathMatch: 'full'
  },
];
