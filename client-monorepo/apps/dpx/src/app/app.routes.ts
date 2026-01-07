import { Route } from '@angular/router';
import { checkRedirectGuard, MainComponent } from '@client-monorepo/app-core';

export const appRoutes: Route[] = [
  {
    path: '',
    component: MainComponent,
    canActivate: [checkRedirectGuard],
    loadChildren: () => import('@client-monorepo/app-core').then((m) => m.MainModule),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
