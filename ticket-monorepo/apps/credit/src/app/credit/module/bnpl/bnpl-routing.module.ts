import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BnplLandingComponent } from './bnpl-landing/bnpl-landing.component';
import { BnplActivationComponent } from './bnpl-activation/bnpl-activation.component';
import { BnplLayoutComponent } from './bnpl-layout/bnpl-layout.component';
import { BnplErrorPageComponent } from './bnpl-error-page/bnpl-error-page.component';
import { BnplFailedScoringPageComponent } from './bnpl-failed-scoring-page/bnpl-failed-scoring-page.component';

const routes: Routes = [
  {
    path: '',
    component: BnplLayoutComponent,
    children: [
      {
        path: '',
        component: BnplLandingComponent,
      },
      {
        path: 'activation',
        component: BnplActivationComponent,
      },
      {
        path: 'error/:errorType',
        component: BnplErrorPageComponent
      },
      {
        path: 'scoring-failed',
        component: BnplFailedScoringPageComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BnplRoutingModule {
}
