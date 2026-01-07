import { Route } from '@angular/router';

export const payClubRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./features/pay-club-main/pay-club-main.component').then((c) => c.PayClubMainComponent),
  },
  {
    path: 'all-reward',
    loadComponent: () => import('./features/all-reward/all-reward.component').then((c) => c.AllRewardComponent),
  },
  {
    path: 'all-points',
    loadComponent: () => import('./features/all-points/all-points.component').then((c) => c.AllPointsComponent),
  },
];
