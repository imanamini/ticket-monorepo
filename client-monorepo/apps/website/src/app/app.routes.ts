import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./website/website.module').then((m) => m.WebsiteModule),
  },
];
