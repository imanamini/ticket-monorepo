import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreditPageComponent } from './credit-page/credit-page.component';
import { routes as creditRoutes } from '../credit/credit-routing.module';

export const routes: Routes = [
  {
    path: '',
    component: CreditPageComponent,
    children: [
      {
        path: '',
        children: creditRoutes,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreditWrapperRoutingModule {}
