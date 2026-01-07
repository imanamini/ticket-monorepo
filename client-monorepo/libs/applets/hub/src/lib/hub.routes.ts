import { Route } from '@angular/router';

export const hubRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./features/hub-main/hub-main.component').then((c) => c.HubMainComponent),
  },
  {
    path: 'main-services',
    loadComponent: () => import('./features/hub-main-services/hub-main-services.component').then((c) => c.HubMainServicesComponent),
  },
  {
    path: 'search',
    loadComponent: () => import('./features/hub-search/hub-search.component').then((c) => c.HubSearchComponent),
  },
];
