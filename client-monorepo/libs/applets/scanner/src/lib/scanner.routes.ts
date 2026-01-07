import { Route } from '@angular/router';

export const scannerRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./features/main-scanner/applets-scanner.component').then((c) => c.AppletsScannerComponent),
  },
];
