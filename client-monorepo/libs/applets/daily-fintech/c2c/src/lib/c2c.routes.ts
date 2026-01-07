import { Route } from '@angular/router';

export const c2cRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./features/c2c-main/c2c-main.component').then((c) => c.C2cMainComponent),
  },
  {
    path: 'shaparak/:type/:id',
    loadComponent: () => import('./features/handle-shaparak/handle-shaparak.component').then((c) => c.HandleShaparakComponent),
  },
];
