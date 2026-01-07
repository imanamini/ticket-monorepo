import { Route } from '@angular/router';
import { retryImport } from '../../util/retry-import-handler';

export const PROFILE_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => retryImport(() => import('./profile.component'), 3, 500).then(c => c.ProfileComponent),
  }
];
