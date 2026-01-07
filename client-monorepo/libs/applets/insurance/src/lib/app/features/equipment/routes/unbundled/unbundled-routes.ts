import { UnbundledLayoutComponent } from './unbundled-layout/unbundled-layout/unbundled-layout.component';
import { Route } from '@angular/router';
import { retryImport } from '../../../../util/retry-import-handler';

export const UNBUNDLED_ROUTES: Route[] = [
  {
    path: '',
    component: UnbundledLayoutComponent,
    children: [
      {
        path: 'home',
        loadComponent: () => retryImport(() => import('./routes/unbundled-home/unbundled-home.component'), 3, 500)
          .then(c => c.UnbundledHomeComponent),
      },
      {
        path: 'payment-result',
        loadComponent: () => retryImport(() => import('./routes/payment-result/payment-result.component'), 3, 500)
          .then(c => c.PaymentResultComponent),
      },
      {
        path: 'fake-buttons',
        loadComponent: () => retryImport(() => import('./routes/fake-buttons/fake-buttons.component'), 3, 500)
          .then(c => c.FakeButtonsComponent),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
      }
    ]
  }
];
