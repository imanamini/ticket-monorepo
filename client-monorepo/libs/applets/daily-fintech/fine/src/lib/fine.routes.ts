import { Route } from '@angular/router';

export const fineRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./features/fine-home/fine-home.component').then((c) => c.FineHomeComponent),
  },
  {
    path: 'select-method/:plateNo',
    loadComponent: () =>
      import('./features/select-fine-inquiry-method/select-fine-inquiry-method.component').then((c) => c.SelectFineInquiryMethodComponent),
  },
  {
    path: 'inquiry/confirm',
    loadComponent: () =>
      import('./features/fine-inquiry-checkout/fine-inquiry-checkout.component').then((c) => c.FineInquiryCheckoutComponent),
  },
  {
    path: 'pay/confirm',
    loadComponent: () => import('./features/fine-checkout/fine-checkout.component').then((c) => c.FineCheckoutComponent),
  },
  {
    path: 'list/:trackingCode',
    loadComponent: () => import('./features/fine-list/fine-list.component').then((c) => c.FineListComponent),
  },
  {
    path: 'image',
    loadComponent: () => import('./features/fine-image/fine-image.component').then((c) => c.FineImageComponent),
  },
];
