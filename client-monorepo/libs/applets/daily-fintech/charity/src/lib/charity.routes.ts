import { Route } from '@angular/router';

export const charityRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./features/charity-main/applets-charity.component').then((c) => c.AppletsCharityComponent),
  },
  {
    path: 'confirm',
    loadComponent: () => import('./features/charity-confirm/charity-confirm.component').then((c) => c.CharityConfirmComponent),
  },
];
