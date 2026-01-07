import { Component, inject, signal } from '@angular/core';
import { PLANS_TYPE, SERVICE_TYPE_PARAM, SubscriptionApiService, SubscriptionPlan } from '@client-monorepo/common/subscription';
import { PlanServicesComponent } from '../../components/plan-services/plan-services.component';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { SubscriptionNavigationService } from '../../data-access/services/subscription-navigation.service';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'subscription-applet-transaction-status',
  templateUrl: './transaction-status.component.html',
  standalone: true,
  styleUrls: ['./transaction-status.component.scss'],
  imports: [PlanServicesComponent, PageLayoutComponent, NgxButtonComponent],
})
export class TransactionStatusComponent {
  navigationService = inject(SubscriptionNavigationService);
  private subscriptionApiService = inject(SubscriptionApiService);
  imageSrc = '';
  plan!: SubscriptionPlan;
  isContinueFlow = signal(false);
  imageClassMapper = {
    [PLANS_TYPE.PLATINUM]: 'assets/subscription/images/transaction-status/platinium-status.svg',
    [PLANS_TYPE.GOLD]: 'assets/subscription/images/transaction-status/gold-status.svg',
    [PLANS_TYPE.SILVER]: 'assets/subscription/images/transaction-status/silver-status.svg',
    [PLANS_TYPE.BRONZE]: 'assets/subscription/images/transaction-status/bronze-status.svg',
    [PLANS_TYPE.BRILLIANCE]: 'assets/subscription/images/transaction-status/brilliance-status.svg',
    [PLANS_TYPE.DIAMOND]: 'assets/subscription/images/transaction-status/diamond-status.svg',
    [PLANS_TYPE.TITANIUM]: 'assets/subscription/images/transaction-status/titanium-status.svg',
    [PLANS_TYPE.PAY_PLUS]: 'assets/subscription/images/transaction-status/pay-plus-status.png',
    [PLANS_TYPE.PAY_PRO]: 'assets/subscription/images/transaction-status/pay-pro-status.png',
  };

  constructor() {
    const serviceType = Number(sessionStorage.getItem('serviceType'));
    if (serviceType === SERVICE_TYPE_PARAM.DIGI_CARD) {
      this.goBack();
      return;
    }
    this.getData();
    this.checkIsContinueFlow();
  }

  private checkIsContinueFlow(): void {
    const serviceType = Number(sessionStorage.getItem('serviceType'));

    this.isContinueFlow.set(serviceType === SERVICE_TYPE_PARAM.credit || serviceType === SERVICE_TYPE_PARAM.DIGI_CARD);
  }

  goBack(): void {
    this.navigationService.exit('success');
  }

  getData(): void {
    this.subscriptionApiService.getUserCurrentPlanApi().subscribe({
      next: (currentPlanRes) => {
        if (currentPlanRes.plan) {
          this.plan = currentPlanRes.plan;
          this.imageSrc = this.imageClassMapper[this.plan.type];
        } else {
          this.goBack();
        }
      },
      error: () => {
        this.goBack();
      },
    });
  }
}
