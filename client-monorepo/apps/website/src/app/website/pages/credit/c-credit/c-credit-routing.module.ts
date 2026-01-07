import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./c-credit.component').then((m) => m.CCreditComponent),
  },
  {
    path: 'v2',
    loadComponent: () => import('./v2/credit-v2/c-credit-v2.component').then((m) => m.CCreditV2Component),
  },
  {
    path: 'tejarat',
    loadComponent: () => import('./sub-pages/providers/providers.component').then((m) => m.ProvidersComponent),
  },
  {
    path: 'digipay',
    loadComponent: () => import('./sub-pages/providers/providers.component').then((m) => m.ProvidersComponent),
  },
  {
    path: 'mellat',
    loadComponent: () => import('./sub-pages/providers/providers.component').then((m) => m.ProvidersComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CCreditRoutingModule {}
