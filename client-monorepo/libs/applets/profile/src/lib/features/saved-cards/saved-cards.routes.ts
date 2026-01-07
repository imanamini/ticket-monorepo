import { Route } from '@angular/router';

export const SavedCardsRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./features/saved-cards/saved-cards.component').then((c) => c.SavedCardsComponent),
  },
  {
    path: ':viewMode/:mode/:cardId',
    loadComponent: () => import('./features/manage-card/manage-card.component').then((c) => c.ManageCardComponent),
  },
  {
    path: ':viewMode/:mode',
    loadComponent: () => import('./features/manage-card/manage-card.component').then((c) => c.ManageCardComponent),
  },
];
