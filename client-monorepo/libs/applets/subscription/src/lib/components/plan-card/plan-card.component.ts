import { Component, computed, input } from '@angular/core';
import { PLANS_TYPE, SubscriptionPlan } from '@client-monorepo/common/subscription';
import { PlanTypeDirective } from '../../data-access/directives/plan-type.directive';
import { DurationInMonthPipe } from '../../data-access/directives/duration-in-month.pipe';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'subscription-applet-plan-card',
  templateUrl: './plan-card.component.html',
  standalone: true,
  styleUrls: ['./plan-card.component.scss'],
  imports: [PlanTypeDirective, DurationInMonthPipe, PipesModule, NgClass]
})
export class PlanCardComponent {
  plan = input<SubscriptionPlan | null>();
  donNotShowDuration = computed(() => {
    return ([PLANS_TYPE.PAY_PRO, PLANS_TYPE.PAY_PLUS] as Array<PLANS_TYPE>).includes(this.plan().type);
  })
}
