import { Route } from '@angular/router';
import { retryImport } from '../../util/retry-import-handler';

export const FAQ_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => retryImport(() => import('./faq.component'), 3, 500).then(c => c.FaqComponent),
  }
];
