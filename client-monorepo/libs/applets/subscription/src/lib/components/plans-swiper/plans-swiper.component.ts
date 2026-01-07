import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { PlanCardComponent } from '../plan-card/plan-card.component';
import { HorizontalScrollComponent } from '@client-monorepo/common/ui-components';
import { SubscriptionPlan } from '@client-monorepo/common/subscription';
import { NgClass } from '@angular/common';
import { NgxDpCarouselComponent, NgxDpCarouselSlideDirective } from '@digipay/ngx-dp-carousel';

@Component({
  selector: 'subscription-applet-plans-swiper',
  standalone: true,
  imports: [PlanCardComponent, HorizontalScrollComponent, NgClass, NgxDpCarouselComponent, NgxDpCarouselSlideDirective],
  templateUrl: './plans-swiper.component.html',
  styleUrls: ['./plans-swiper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlansSwiperComponent {
  plans = input.required<SubscriptionPlan[]>();

  selectPlan = output<SubscriptionPlan>();

  selectedPlan = signal<SubscriptionPlan>({} as SubscriptionPlan);
  selectedPlanIndex = signal<number>(0);
  checkActivePlan(index: number): void {
    this.selectPlan.emit(this.plans()[index]);
    this.selectedPlanIndex.set(index);
    this.scrollElement(index);
  }
  private scrollElement(index: number): void {
    const element = document.getElementById(`plan-title-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }
  selectedTitle(plan: SubscriptionPlan, index: number): void {
    this.selectPlan.emit(this.plans()[index]);
    this.selectedPlanIndex.set(index);
    this.selectedPlan.set(plan);
    this.scrollElement(index);
  }
}
