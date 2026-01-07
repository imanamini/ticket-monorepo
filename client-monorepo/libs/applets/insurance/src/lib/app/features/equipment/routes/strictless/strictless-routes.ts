import { StrictlessLayoutComponent } from './strictless-layout/strictless-layout.component';
import { Route } from '@angular/router';
import { retryImport } from '../../../../util/retry-import-handler';

export const STRICTLESS_ROUTES: Route[] = [
  {
    path: 'policy',
    component: StrictlessLayoutComponent,
    children: [
      {
        path: 'anonymous',
        loadComponent: () =>
          retryImport(() => import('./strictless-anonymous-claim/anonymous-claim.component'), 3, 500).then(
            (c) => c.AnonymousClaimComponent,
          ),
      },
      {
        path: 'inquiry',
        loadComponent: () => retryImport(() => import('./strictless-inquiry/inquiry.component'), 3, 500).then((c) => c.InquiryComponent),
      },
      {
        path: 'transfer',
        loadComponent: () =>
          retryImport(() => import('./strictless-transfer-policy/transfer-policy.component'), 3, 500).then(
            (c) => c.TransferPolicyComponent,
          ),
      },
    ],
  },
];
