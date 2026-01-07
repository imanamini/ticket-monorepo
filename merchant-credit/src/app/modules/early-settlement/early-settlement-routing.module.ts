import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EarlySettlementComponent } from './early-settlement/early-settlement.component';
import { EarlySettlementListComponent } from './early-settlement-list/early-settlement-list.component';
import { EarlySettlementNoTicketComponent } from './early-settlement-no-ticket/early-settlement-no-ticket.component';

const routes: Routes = [
  {
    path: '',
    component: EarlySettlementComponent
  },
  {
    path: 'list',
    component: EarlySettlementListComponent
  },
  {
    path: 'no-ticket',
    component: EarlySettlementNoTicketComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EarlySettlementRoutingModule {
}
