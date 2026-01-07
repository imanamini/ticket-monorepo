import { Component, input } from '@angular/core';
import { PLANS_TYPE, SubscriptionPlan } from '@client-monorepo/common/subscription';
import { NgClass } from '@angular/common';

@Component({
  selector: 'subscription-applet-subscription-badge',
  standalone: true,
  templateUrl: './subscription-badge.component.html',
  styleUrls: ['./subscription-badge.component.scss'],
  imports: [NgClass],
})
export class SubscriptionBadgeComponent {
  plan = input.required<SubscriptionPlan>();

  subscriptionClassMapper = {
    [PLANS_TYPE.PLATINUM]: 'is-platinium',
    [PLANS_TYPE.GOLD]: 'is-gold',
    [PLANS_TYPE.SILVER]: 'is-silver',
    [PLANS_TYPE.BRONZE]: 'is-bronze',
    [PLANS_TYPE.BRILLIANCE]: 'is-brilliance',
    [PLANS_TYPE.DIAMOND]: 'is-diamond',
    [PLANS_TYPE.TITANIUM]: 'is-titanium',
    [PLANS_TYPE.PAY_PLUS]: 'is-pay-plus',
    [PLANS_TYPE.PAY_PRO]: 'is-pay-pro',
  };
}
