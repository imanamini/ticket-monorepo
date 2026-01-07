import { Route } from '@angular/router';
import { retryImport } from '../../util/retry-import-handler';

export const PROVIDER_ROUTES: Route[] = [
  {
    path: 'payment-result',
    loadComponent: () => retryImport(() => import('./provider.component'), 3, 500).then(c => c.ProviderComponent),
  }
];
