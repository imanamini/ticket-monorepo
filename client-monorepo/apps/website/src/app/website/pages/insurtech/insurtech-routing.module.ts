import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
  {
    path: 'equipment',
    loadComponent: () => import('./insurtech.component').then((m) => m.InsurtechComponent),
  },
  {
    path: 'activation',
    loadComponent: () => import('../insurtech-activation/insurtech-activation.component').then((m) => m.InsurtechActivationComponent),
  },
  {
    path: 'third-party-insurance',
    loadComponent: () => import('./third-party-insurance/third-party-insurance-v2.component').then((m) => m.ThirdPartyInsuranceV2Component),
  },


];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports:[RouterModule]
})
export class InsurtechRoutingModule { }
