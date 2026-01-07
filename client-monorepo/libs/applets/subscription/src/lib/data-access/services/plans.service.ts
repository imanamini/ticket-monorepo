import { Inject, inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { SubscriptionApiService, SubscriptionPlan } from '@client-monorepo/common/subscription';
import { StorageService, stringHasKeyword } from '@client-monorepo/common/utilities';
import { PayClientApiService, PaymentUrlService, TicketTypes, UPG_TICKET_PREFIX } from '@client-monorepo/payment/purchase';

@Injectable({
  providedIn: 'root',
})
export class PlansService {
  subscriptionPlans = new BehaviorSubject<SubscriptionPlan[] | null>(null);

  userCustomPlanUuid = new BehaviorSubject<string | null>(null);

  private readonly storageService = inject(StorageService);
  private readonly paymentUrlService = inject(PaymentUrlService);
  private readonly payClientApiService = inject(PayClientApiService);

  constructor(
    private subscriptionApiService: SubscriptionApiService,
    @Inject('APP_ENV') private environment: { [key: string]: string },
  ) {}

  getSubscriptionPlans() {
    this.subscriptionApiService.getSubscriptionPlansApi().subscribe({
      next: (res) => {
        this.subscriptionPlans.next(res.plans);
      },
    });
  }

  resetSubscriptionPlans(): void {
    this.subscriptionPlans.next(null);
  }
  setUserCustomPlanUuid(uuid: string) {
    this.storageService.setSubscriptionStorage({ planId: uuid });
    this.userCustomPlanUuid.next(uuid);
  }

  checkUserCustomPlanUuid(): void {
    const storageUuid = this.storageService.getSubscriptionStorage().planId;
    if (storageUuid && !this.userCustomPlanUuid.getValue()) {
      this.userCustomPlanUuid.next(storageUuid);
    } else return;
  }

  purchaseSubscription(planUuid: string, isFastFlow = false): Observable<any> {
    const redirectUrl = this.paymentUrlService.appCallbackUrl('/payment/result/subscription', true);
    const afterResultUrl = this.getPaymentCallbackUrl(planUuid, isFastFlow);

    const params = {
      uuid: planUuid,
      redirectUrl,
      redirectDetail: {
        text: 'ادامه فرآیند',
        method: 1,
        path: afterResultUrl,
      },
    };

    return this.payClientApiService.getTicket(TicketTypes.SUBSCRIPTION, params).pipe(
      tap((result) => {
        const ticket = result.ticket;

        if (stringHasKeyword(ticket, UPG_TICKET_PREFIX, false, 'START')) {
          window.open(result.redirectUrl, '_self');
        }
      }),
    );
  }

  private getPaymentCallbackUrl(planUuid: string, isFastFlow = false) {
    const getSubscriptionStorage = this.storageService.getSubscriptionStorage();
    const callbackUrl = getSubscriptionStorage?.callbackUrl;
    if (isFastFlow && callbackUrl) {
      const finalUrl = callbackUrl.replace(this.environment['app_url'], '');
      return this.paymentUrlService.appCallbackUrl(finalUrl);
    } else {
      return this.paymentUrlService.appCallbackUrl(`/subscription/transaction-status/${planUuid}`);
    }
  }

  resetUserSubscriptionPurchaseState() {
    this.storageService.removeSubscriptionStorage();
    this.setUserCustomPlanUuid('');
  }
}
