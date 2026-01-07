import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditApiService } from '../../data-access/services/credit-api.service';
import { CreditUrlService } from '../../data-access/utils/url';
import { MessageService } from '../../data-access/services/message.service';
import { SUBSCRIPTION_STATUS } from '../../data-access/models/credit/activation/subscription/subscription-status';
import { SubscriptionDetail } from '../../data-access/models/credit/activation/subscription/subscription-status.response';
import { CreditNavigationService } from '../../data-access/services/credit-navigation.service';
import { CreditSubscriptionDelayedComponent } from './credit-subscription-delayed/credit-subscription-delayed.component';
import { CreditSubscriptionInProgressComponent } from './credit-subscription-in-progress/credit-subscription-in-progress.component';
import { CreditSubscriptionSucceedComponent } from './credit-subscription-succeed/credit-subscription-succeed.component';
import { CreditSubscriptionFailedComponent } from './credit-subscription-failed/credit-subscription-failed.component';
import { CreditSubscriptionBuyInfoComponent } from './credit-subscription-buy-info/credit-subscription-buy-info.component';
import { ALLOCATION_PAYMENT_METHOD } from '../../data-access/models/credit/pre-registration/credit-plan-group';
import { CreditPageLoadingComponent } from '../../components/credit-page-loading/credit-page-loading.component';
import { CreditSubscriptionDigipayAcceptedComponent } from './credit-subscription-digipay-accepted/credit-subscription-digipay-accepted.component';
import { CreditSubscriptionRejectedComponent } from './credit-subscription-rejected/credit-subscription-rejected.component';

@Component({
  selector: 'app-credit-subscription',
  templateUrl: './credit-subscription.component.html',
  styleUrls: ['./credit-subscription.component.scss'],
  imports: [
    CreditSubscriptionDelayedComponent,
    CreditSubscriptionInProgressComponent,
    CreditSubscriptionSucceedComponent,
    CreditSubscriptionFailedComponent,
    CreditSubscriptionBuyInfoComponent,
    CreditPageLoadingComponent,
    CreditSubscriptionDigipayAcceptedComponent,
    CreditSubscriptionRejectedComponent,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditSubscriptionComponent implements OnInit {
  fundProviderCode!: number;
  countDay = signal<number>(0);
  description = computed<string>(
    () => `اشتراک مورد نیاز شما با موفقیت فعال‌ شده است. ارسال مدارک به بانک ${this.countDay()} روز آینده انجام خواهد شد.`,
  );
  title = 'در انتظار ارسال به بانک';
  creditId!: string;
  gettingStatus = signal<boolean | null>(null);
  status = signal<SUBSCRIPTION_STATUS | null>(null);
  subscriptionDetail = signal<SubscriptionDetail | null>(null);
  chosenPaymentMethod = signal<ALLOCATION_PAYMENT_METHOD>(ALLOCATION_PAYMENT_METHOD.PECUNIARY);
  protected readonly statusEnum = SUBSCRIPTION_STATUS;

  private activatedRoute = inject(ActivatedRoute);
  private creditApiService = inject(CreditApiService);
  private creditUrlService = inject(CreditUrlService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private creditNavigationService = inject(CreditNavigationService);

  ngOnInit(): void {
    this.fundProviderCode = +this.activatedRoute.snapshot.params['fundProviderCode'];
    this.creditId = this.activatedRoute.snapshot.params['creditId'];
    this.getStatus();
  }

  closeStep(): void {
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`/wallet/activation/steps/${this.fundProviderCode}/${this.creditId}`),
    );
  }

  nextStep(): void {
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`/wallet/activation/steps/${this.fundProviderCode}/${this.creditId}/next`),
    );
  }

  getStatus() {
    this.gettingStatus.set(true);
    this.creditApiService.getSubscriptionStatus(this.creditId).subscribe({
      next: (response) => {
        this.status.set(response.status);
        this.subscriptionDetail.set(response.detail);

        if (response.status === this.statusEnum.INITIATED) {
          this.subscriptionInitiate(undefined, true);
          return;
        }

        if (this.subscriptionDetail()?.delayRemainingDays) {
          this.countDay.set(this.subscriptionDetail()?.delayRemainingDays!);
        }
        this.gettingStatus.set(false);
      },
      error: (error) => {
        this.messageService.showErrorOfErrorResponse(error);
        this.closeStep();
      },
    });
  }

  subscriptionInitiate(allocationPaymentMethodType?: ALLOCATION_PAYMENT_METHOD, initOnly = false) {
    this.gettingStatus.set(true);
    this.creditApiService.subscriptionInitiate(this.creditId, allocationPaymentMethodType).subscribe({
      next: () => {
        if (initOnly) {
          this.gettingStatus.set(false);
          return;
        }
        if (allocationPaymentMethodType === ALLOCATION_PAYMENT_METHOD.PECUNIARY) {
          this.gotoSubscription();
          return;
        }
        this.chosenPaymentMethod.set(ALLOCATION_PAYMENT_METHOD.PECUNIARY_CREDIT);
        this.getStatus();
      },
      error: (error) => {
        this.gettingStatus.set(false);
        this.messageService.showErrorOfErrorResponse(error);
      },
    });
  }

  gotoSubscription(): void {
    this.creditNavigationService.navigateToSubscription(this.subscriptionDetail()?.subscriptionPlanId!);
  }

  goToPaymentInfo() {
    this.status.set(this.statusEnum.PAYMENT_CHOOSE);
  }
}
