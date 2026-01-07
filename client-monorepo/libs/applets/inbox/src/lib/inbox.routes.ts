import { Route } from '@angular/router';

export const inboxRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./features/inbox-main/inbox-main.component').then((c) => c.InboxMainComponent),
  },
];
