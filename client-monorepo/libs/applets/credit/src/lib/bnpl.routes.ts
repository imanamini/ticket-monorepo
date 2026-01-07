import { Route } from '@angular/router';

export const bnplRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'resolve',
    pathMatch: 'full',
  },
  {
    path: '',
    loadChildren: () =>
      import('./features/bnpl-wrapper/bnpl-wrapper.module').then(
        (m) => m.BnplWrapperModule,
      ),
  },
];
