import { UsedLayoutComponent } from './used-layout/used-layout.component';
import { Route } from '@angular/router';

export const USED_ROUTES: Route[] = [
  {
    path: '',
    component: UsedLayoutComponent
  },
  {
    path: 'payment-result',
    redirectTo: '',
    pathMatch: 'full'
  },
];
