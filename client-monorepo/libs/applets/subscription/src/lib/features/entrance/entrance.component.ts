import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlansService } from '../../data-access/services/plans.service';
import { PerformanceTierService, StorageService } from '@client-monorepo/common/utilities';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { SubscriptionManagementService } from '../../data-access/services/subscription-management.service';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { Buttons, NgxStatusResultModule } from '@digipay/ngx-status-result';
import { BackHandlerService } from '@client-monorepo/back-handler';
import { AnimationLoader, LottieComponent, provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web/build/player/lottie_light';

@Component({
  selector: 'subscription-applet-app-entrance',
  standalone: true,
  templateUrl: './entrance.component.html',
  styleUrls: ['./entrance.component.scss'],
  imports: [NgxSpinnerModule, PageLayoutComponent, NgxStatusResultModule, LottieComponent],
  providers: [
    AnimationLoader,
    provideLottieOptions({
      player: () => player,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntranceComponent implements OnInit {
  storageService = inject(StorageService);
  activatedRoute = inject(ActivatedRoute);
  private subscriptionManagementService = inject(SubscriptionManagementService);
  private backHandlerService = inject(BackHandlerService);
  private performanceTierService = inject(PerformanceTierService);

  isLoading = signal(true);
  hasError = signal(false);
  waitingAnimation = signal('/assets/subscription/images/Subscription_loading.json');
  loadingEffect = computed(() => this.performanceTierService.tier() !== 'low');
  showBackIcon = signal(false);

  errorStateButtons: Buttons[] = [
    {
      id: 'secondary',
      label: 'بازگشت',
      style: 'tinted-on-elevated',
      mode: 'form',
      fullWidth: true,
    },
    {
      id: 'primary',
      label: 'تلاش مجدد',
      style: 'fill',
      mode: 'form',
      fullWidth: true,
      rightIcon: { name: 'refresh' },
    },
  ];
  // TODO: Remove planUuid to use from userCustomPlanUuid
  private planUuid = '';
  private isFastFlow = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private plansService: PlansService,
  ) {}

  ngOnInit(): void {
    // if user is being redirected from a different place
    // like Express, check and set the origin query param
    this.checkAndSetOrigin();
    this.setServiceType();
    this.goToNextStep();
    setTimeout(() => {
      this.showBackIcon.set(true);
    }, 5000);
  }

  // Check if user has plan navigate to management route. Otherwise, start purchase flow.
  checkUserPlan(): void {
    this.subscriptionManagementService
      .getUserCurrentPlan()
      .then((result) => {
        if (result) {
          this.router.navigateByUrl('subscription/subscription-management', { replaceUrl: true }).then();
          return;
        }
      })
      .catch(() => {
        this.purchaseSubscription();
      });
  }

  private goToNextStep() {
    if (!this.isFastFlow) {
      this.navigateUser();
      return;
    }
    this.checkUserPlan();
  }

  private purchaseSubscription(): void {
    this.hasError.set(false);
    this.plansService.purchaseSubscription(this.planUuid, true).subscribe({
      error: () => {
        this.isLoading.set(false);
        this.showBackIcon.set(true);
        this.hasError.set(true);
      },
    });
  }

  private navigateUser(): void {
    this.router.navigate(['..'], { replaceUrl: true, relativeTo: this.route }).then();
  }

  private setServiceType(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      const serviceType = params['serviceType'];
      if (serviceType) {
        sessionStorage.setItem('serviceType', serviceType);
      }
    });
  }

  private checkAndSetOrigin(): void {
    const callbackUrl = this.route.snapshot.queryParamMap.get('callback-url') || '';
    const fallbackUrl = this.route.snapshot.queryParamMap.get('fallback-url') || '';
    const planUuid = this.route.snapshot.queryParamMap.get('plan-id') || '';
    const isFastFlow = this.route.snapshot.queryParamMap.get('is-fast-flow') || false;

    if (planUuid) {
      this.planUuid = planUuid;
      this.plansService.setUserCustomPlanUuid(planUuid);
    } else {
      this.plansService.resetUserSubscriptionPurchaseState();
      this.navigateUser();
      return;
    }

    if (isFastFlow) {
      this.isFastFlow = Boolean(isFastFlow);
    }

    if (callbackUrl || fallbackUrl) {
      this.storageService.setSubscriptionStorage({
        callbackUrl: callbackUrl || '',
        fallbackUrl: fallbackUrl || '',
        callbackExpTime: '' + (+new Date() + 1000 * 60 * 20),
      });
    }
  }

  onClickStatueResult(id: string) {
    if (id === 'primary') {
      this.retry();
      return;
    }

    if (id === 'secondary') {
      this.backHandlerService.goBack();
      return;
    }
  }

  private retry() {
    this.isLoading.set(true);
    this.purchaseSubscription();
  }
}
