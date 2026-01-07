import { Route } from '@angular/router';

export const barcodeRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./show-barcode/show-barcode.component').then((c) => c.ShowBarcodeComponent),
  },
];
