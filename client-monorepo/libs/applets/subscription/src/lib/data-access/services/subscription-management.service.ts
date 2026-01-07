import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CashbackData, SubscriptionApiService, SubscriptionPlan } from '@client-monorepo/common/subscription';
import { CampaignClientService } from './campaign-client.service';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionManagementService {
  userCashback = new BehaviorSubject<CashbackData[] | null>(null);
  private subscriptionApiService = inject(SubscriptionApiService);
  private campaignClientService = inject(CampaignClientService);

  getUserCurrentPlan(): Promise<SubscriptionPlan> {
    return new Promise((resolve, reject) => {
      this.subscriptionApiService.getUserCurrentPlanApi().subscribe({
        next: (res) => {
          resolve(res?.plan);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  getUserCashback() {
    this.campaignClientService.getUserCashbackApi().subscribe({
      next: (res) => {
        this.userCashback.next(res.caps);
      },
    });
  }
}
