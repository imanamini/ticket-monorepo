import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PayRouterComponent } from './pay-router/pay-router.component';

const routes: Routes = [
  {
    path: ':ticket',
    component: PayRouterComponent,
    canActivate: [],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaySeparatelyRoutingModule {
}
