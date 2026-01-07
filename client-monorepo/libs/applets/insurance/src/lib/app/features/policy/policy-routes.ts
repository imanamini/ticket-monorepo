import { Route } from '@angular/router';
import { retryImport } from '../../util/retry-import-handler';

export const POLICY_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    loadComponent: () => retryImport(() => import('./features/policy-list/policy-list.component'), 3, 500).then(c => c.PolicyListComponent),
  },
  {
    path: 'detail',
    loadComponent: () => retryImport(() => import('./features/policy-detail/policy-detail.component'), 3, 500).then(c => c.PolicyDetailComponent)
  }
];
