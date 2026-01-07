import { Route } from '@angular/router';

export const billRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./features/bill-main/bill-main-applet.component').then((c) => c.BillMainAppletComponent),
  },
  {
    path: 'identifier/:type',
    loadComponent: () => import('./features/bill-validate/bill-validate.component').then((c) => c.BillValidateComponent),
  },
  {
    path: 'confirm',
    loadComponent: () => import('./features/bill-confirm/bill-confirm.component').then((c) => c.BillConfirmComponent),
  },
];
