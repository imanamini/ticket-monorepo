import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WithdrawalDetailComponent } from './withdrawal-detail.component';

const routes: Routes = [
  {path: '', component: WithdrawalDetailComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WithdrawalDetailRoutingModule {
}
