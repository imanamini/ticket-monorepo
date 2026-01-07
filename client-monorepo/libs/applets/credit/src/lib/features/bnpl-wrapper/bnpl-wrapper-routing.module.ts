import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BnplPageComponent } from './bnpl-page/bnpl-page.component';

const routes: Routes = [
  {
    path: '',
    component: BnplPageComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('../credit/credit.module').then((m) => m.CreditModule),
      },
    ],
    data: { preload: true, critical: true },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BnplWrapperRoutingModule {}
