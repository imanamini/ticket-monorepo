import { Route } from '@angular/router';

export const escrowDeliveryRoutes: Route[] = [
  {
    path: 'setting/:trackingCode',
    loadComponent: () => import('./features/delivery-setting/delivery-setting.component').then((c) => c.DeliverySettingComponent),
  },
];
