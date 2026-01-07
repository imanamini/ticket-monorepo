import { Routes } from '@angular/router';
import { retryImport } from './app/util/retry-import-handler';

export const insuranceRoutes: Routes = [
  {
    path: '',
    loadComponent: () => retryImport(() => import('./app/app.component'), 3, 500).then((m) => m.AppComponent),
    loadChildren: () => retryImport(() => import('./app/app-routes'), 3, 500).then((m) => m.APP_ROUTES),
  },
];
