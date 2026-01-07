import { Route } from '@angular/router';
import { retryImport } from '../../util/retry-import-handler';

export const CLAIM_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => retryImport(() => import('./claim.component'), 3, 500).then(c => c.ClaimComponent),
    children: [
      {
        path: 'register',
        loadChildren: () => retryImport(() => import('./routes/claim-register/claim-register-routes'), 3, 500).then(m => m.CLAIM_REGISTER_ROUTES)
      },
      {
        path: 'list',
        loadComponent: () => retryImport(() => import('./routes/claim-list/claim-list.component'), 3, 500).then(c => c.ClaimListComponent)
      }
    ]
  },
];
