import { Inject, inject, Injectable } from '@angular/core';
import { StorageService } from '@client-monorepo/common/utilities';
import { Router } from '@angular/router';
import { PlansService } from './plans.service';
import { BackHandlerService } from '@client-monorepo/back-handler';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionNavigationService {
  storageService = inject(StorageService);
  router = inject(Router);
  plansService = inject(PlansService);
  backHandlerService = inject(BackHandlerService);

  constructor(@Inject('APP_ENV') private environment: { [key: string]: string }) {}

  public exit(result?: 'success' | 'failed'): void {
    const getSubscriptionStorage = this.storageService.getSubscriptionStorage();
    const callbackUrl = getSubscriptionStorage?.callbackUrl;
    const fallbackUrl = getSubscriptionStorage?.fallbackUrl;
    const queryParams: { [key: string]: string } = result ? { result } : {};
    this.plansService.resetUserSubscriptionPurchaseState();
    if (result === 'failed' && fallbackUrl) {
      this.redirectWithParams(fallbackUrl, queryParams);
      return;
    }
    if (callbackUrl) {
      this.redirectWithParams(callbackUrl, queryParams);
      return;
    }
    if (result === 'success') {
      this.navigateToManagement();
      return;
    }
    this.navigateToHub();
  }
  private navigateToManagement(): void {
    const subscriptionManagementRoute = 'subscription/subscription-management?result=success';
    this.router.navigateByUrl(subscriptionManagementRoute).then();
  }

  private navigateToHub(): void {
    this.router.navigateByUrl('/').then();
  }

  private redirectWithParams(url: string, queryParams: { [key: string]: string } = {}): void {
    const finalUrl = url.replace(this.environment['app_url'], '');
    if (finalUrl.startsWith('http')) {
      const urlInstance = new URL(url);
      Object.keys(queryParams).forEach((key) => {
        urlInstance.searchParams.set(key, queryParams[key]);
      });
      window.location.replace(urlInstance);
    } else {
      this.router.navigate(['/' + finalUrl], { queryParams, replaceUrl: true });
    }
  }
}
