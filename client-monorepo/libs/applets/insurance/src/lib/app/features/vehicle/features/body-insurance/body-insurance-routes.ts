import { Routes } from '@angular/router';
import { retryImport } from '../../../../util/retry-import-handler';

export const BODY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => retryImport(() => import('./body-insurance.component'), 3, 500).then(m => m.BodyInsuranceComponent),
  }
];