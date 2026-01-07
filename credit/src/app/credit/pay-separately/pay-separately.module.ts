import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaySeparatelyComponent } from './pay-separately/pay-separately.component';
import { PaySeparatelyRoutingModule } from './pay-separately-routing.module';
import { CreditUiModule } from '../credit-ui/credit-ui.module';
import { PayStepsComponent } from './pay-steps/pay-steps.component';
import { SharedModule } from '../shared';
import { StepProgressBarComponent } from './step-progress-bar/step-progress-bar.component';
import { CountdownModule } from 'ngx-countdown';
import { PayRouterComponent } from './pay-router/pay-router.component';

@NgModule({
  declarations: [
    PaySeparatelyComponent,
    PayStepsComponent,
    StepProgressBarComponent,
    PayRouterComponent
  ],
  imports: [
    CommonModule,
    PaySeparatelyRoutingModule,
    CreditUiModule,
    SharedModule,
    CountdownModule,
  ]
})
export class PaySeparatelyModule { }
