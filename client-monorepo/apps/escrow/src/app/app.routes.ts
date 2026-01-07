import { Route } from '@angular/router';
import { MainComponent } from './features/layouts/main/main.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: MainComponent,
    loadChildren: () => import('./features/layouts/main/main.module').then((m) => m.MainModule),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
