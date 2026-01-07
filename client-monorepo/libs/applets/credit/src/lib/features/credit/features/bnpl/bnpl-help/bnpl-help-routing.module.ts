import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./bnpl-help/bnpl-help.component').then((m) => m.BnplHelpComponent),
  },
  {
    path: ':bnplType/:customerType',
    loadComponent: () => import('./bnpl-help/bnpl-help.component').then((m) => m.BnplHelpComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BnplHelpRoutingModule {}
