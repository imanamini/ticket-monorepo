import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreditCampaignComponent } from './credit-campaign.component';

const routes: Routes = [
  {
    path: ':slug',
    component: CreditCampaignComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreditCampaignRoutingModule {
}
