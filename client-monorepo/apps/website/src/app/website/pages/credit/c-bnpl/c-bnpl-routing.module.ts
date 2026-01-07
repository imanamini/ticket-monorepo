import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./c-bnpl/c-bnpl.component').then((m) => m.CBnplComponent),
  },
  {
    path:'v2',
    loadComponent:() => import('./c-bnpl/v2/c-bnpl.component').then((m) => m.CBnplComponent),
  },
  {
    path: 'get-bnpl',
    loadComponent: () => import('./bnpl-request/bnpl-request.component').then((m) => m.BnplRequestComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CBnplRoutingModule {}
