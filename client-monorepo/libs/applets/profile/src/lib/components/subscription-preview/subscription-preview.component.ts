import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CircleProgressBarComponent } from '../circle-progress-bar/circle-progress-bar.component';
import { SubscriptionBgComponent } from '../subscription-bg/subscription-bg.component';
import { DiamondComponent } from '../diamond/diamond.component';
import { SubscriptionApiService, SubscriptionColors, UserPlan } from '@client-monorepo/common/subscription';

import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';

@Component({
  selector: 'profile-applet-subscription-preview',
  standalone: true,
  imports: [CommonModule, CircleProgressBarComponent, DiamondComponent, SubscriptionBgComponent, NgxSkeletonLoadingComponent],
  templateUrl: './subscription-preview.component.html',
  styleUrl: './subscription-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionPreviewComponent implements OnInit {
  subscriptionService = inject(SubscriptionApiService);
  userPlan!: UserPlan;
  subscriptionColors = SubscriptionColors;
  initialized = signal(false);

  bgColor = '#F4F4F4';
  progressColor = '#B4B7BD';
  diamondColor = '#EFEFEF';
  contentDescription = 'ندارد';
  btnText = 'خرید اشتراک';

  cdrf = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.subscriptionService.getUserSubscription().subscribe({
      next: (data) => {
        this.userPlan = data.plan;
        this.decideForPlanDescription();
        this.initialized.set(true);
        this.cdrf.markForCheck();
      },
      error: () => this.initialized.set(true),
    });
  }

  decideForPlanDescription(): void {
    const subscriptionColor = this.subscriptionColors.find((sc) => sc.type === this.userPlan.type);
    if (subscriptionColor) {
      this.bgColor = subscriptionColor.bgColor;
      this.progressColor = subscriptionColor.progressColor;
      this.diamondColor = subscriptionColor.diamondColor;
    }
    this.btnText = 'مدیریت اشتراک';
    this.contentDescription = 'اشتراک ' + this.userPlan.title;
  }
}
