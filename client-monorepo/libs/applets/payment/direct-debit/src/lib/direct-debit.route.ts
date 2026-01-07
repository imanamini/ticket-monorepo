import { Route } from '@angular/router';
import { directDebitGuard } from './data-access/guard/direct-debit.guard';

export const directDebitRoutes: Route[] = [
  {
    path: '',
    canActivate: [directDebitGuard],
    children: [
      {
        path: 'create',
        loadComponent: () =>
          import('./features/contract-create/contract-create.component').then((result) => result.ContractCreateComponent),
      },
      {
        path: 'list',
        loadComponent: () => import('./features/contract-list/contract-list.component').then((result) => result.ContractListComponent),
      },
      {
        path: 'result',
        loadComponent: () =>
          import('./features/contract-results/contract-results.component').then((result) => result.ContractResultsComponent),
      },
      {
        path: 'faq',
        loadComponent: () => import('./features/faq/faq.component').then((result) => result.FaqComponent),
      },
    ],
  },
];
