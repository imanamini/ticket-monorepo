import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'b2o',
    pathMatch: 'full',
    loadComponent: () => import('./b2o-landing/b2o-landing.component').then((m) => m.B2oLandingComponent),
  },
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./simple-page.component').then((m) => m.SimplePageComponent),
  },
  {
    path: ':slug',
    pathMatch: 'full',

    loadComponent: () => import('./simple-page.component').then((m) => m.SimplePageComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SimplePageRoutingModule {}
