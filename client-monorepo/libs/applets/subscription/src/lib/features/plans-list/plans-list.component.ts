import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlansService } from '../../data-access/services/plans.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { PlansSwiperComponent } from '../../components/plans-swiper/plans-swiper.component';
import { PlanServices, SERVICE_TYPE_PARAM, SERVICES_TYPE, SubscriptionPlan, SubscriptionRules } from '@client-monorepo/common/subscription';
import { PlanServicesComponent } from '../../components/plan-services/plan-services.component';
import { PlansListSkeletonComponent } from '../../components/plans-list-skeleton/plans-list-skeleton.component';
import { SubscriptionManagementService } from '../../data-access/services/subscription-management.service';
import { SubscriptionNavigationService } from '../../data-access/services/subscription-navigation.service';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxCheckboxComponent } from '@digipay/ngx-checkbox';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgxStateService } from '@digipay/ngx-status-result';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { formatPriceToString, MessageService } from '@client-monorepo/common/utilities';
import { NgxAlert } from '@digipay/ngx-alert';

@Component({
  selector: 'subscription-applet-plans-list',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    PlansSwiperComponent,
    PlanServicesComponent,
    PlansListSkeletonComponent,
    NgxButtonComponent,
    NgxCheckboxComponent,
    NgxCalloutComponent,
    NgxAlert,
  ],
  templateUrl: './plans-list.component.html',
  styleUrl: './plans-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlansListComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private plansService = inject(PlansService);
  private subscriptionManagementService = inject(SubscriptionManagementService);
  private navigationService = inject(SubscriptionNavigationService);
  private destroyRef = inject(DestroyRef);
  private ngxStateService = inject(NgxStateService);
  private cdr = inject(ChangeDetectorRef);
  private readonly messageService = inject(MessageService);

  rulesTemplate = viewChild<TemplateRef<any>>('rulesContainer');

  isRuleAccept = signal(false);

  plans = signal<SubscriptionPlan[]>([]);

  selectedPlan = signal<SubscriptionPlan>({} as SubscriptionPlan);

  isLoading = signal(true);

  rules = signal<SubscriptionRules>({} as SubscriptionRules);

  isPayClicked = signal(false);

  alertText = computed(() => {
    const creditService = this.selectedPlan().services.find((service: PlanServices) => service.type === SERVICES_TYPE.CREDIT);

    const amount = creditService ? formatPriceToString(+creditService.amount) : '۰';
    return `خرید این اشتراک به معنای دریافت وام تا سقف ${amount} نیست. برای اطمینان از اینکه تا چه مبلغی می‌توانید وام دریافت کنید ابتدا اعتبارسنجی بانکی انجام دهید تا طرح متناسب با شرایط خود را بخرید.`;
  });

  showAlert = computed(() => {
    const hasCreditService = this.selectedPlan()?.services.some((service) => service.type === SERVICES_TYPE.CREDIT);
    return !(this.isCreditJourney || !hasCreditService);
  });

  userCustomPlanUuid: string | null = null;

  url: string[] = [];

  isCreditJourney = false;

  ngOnInit(): void {
    this.setPlans();
    this.checkUserPlan();
    this.checkPlanIdParam();
    this.checkIsCreditJourney();
    this.plansService.checkUserCustomPlanUuid();
    this.getUserCustomPlanUuid();
  }

  // Check if user has plan navigate to management route. Otherwise, get plans list.
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
        this.plansService.getSubscriptionPlans();
      });
  }

  checkPlanIdParam(): void {
    const planUuid = this.route.snapshot.queryParamMap.get('plan-id') || '';
    if (planUuid) {
      this.plansService.setUserCustomPlanUuid(planUuid);
    }
  }

  private checkIsCreditJourney(): void {
    const hasServiceTypeSession = sessionStorage.getItem('serviceType');
    if (hasServiceTypeSession && +hasServiceTypeSession === SERVICE_TYPE_PARAM.credit) {
      this.isCreditJourney = true;
    }
  }

  getUserCustomPlanUuid(): void {
    this.plansService.userCustomPlanUuid.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((uuid) => {
      this.userCustomPlanUuid = uuid;
    });
  }

  setPlans(): void {
    this.plansService.subscriptionPlans.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res: any) => {
      if (res?.length > 0) {
        this.plans.set(this.filterPlans(res));
        this.selectedPlan.set(this.plans()[0]);
        this.setPlanRules(this.plans()[0]);
        this.isLoading.set(false);
        this.cdr.detectChanges();
      }
    });
  }

  filterPlans(plans: SubscriptionPlan[]): SubscriptionPlan[] {
    if (!this.userCustomPlanUuid) {
      return plans;
    }
    return plans.filter((plan) => plan?.uuid === this.userCustomPlanUuid);
  }

  ngOnDestroy(): void {
    this.plansService.resetSubscriptionPlans();
  }

  selectPlan(plan: SubscriptionPlan): void {
    this.selectedPlan.set(plan);
    this.setPlanRules(plan);
    if (this.isRuleAccept()) {
      this.isRuleAccept.set(false);
    }
  }

  onPurchaseClicked(): void {
    this.isPayClicked.set(true);

    this.plansService
      .purchaseSubscription(this.selectedPlan().uuid)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isPayClicked.set(false);
        },
        error: (error) => {
          this.isPayClicked.set(false);
          this.messageService.showErrorOfErrorResponse(error);
        },
      });
  }

  onBackAction() {
    this.navigationService.exit();
  }

  setPlanRules(plan: SubscriptionPlan): void {
    const steps: string[] = [];

    const hasCoin = plan.services.some((s) => s.type === SERVICES_TYPE.COIN);
    const hasCreditOrBnpl = plan.services.some(
      (s) =>
        s.type === SERVICES_TYPE.CREDIT ||
        s.type === SERVICES_TYPE.BNPL_1PAY ||
        s.type === SERVICES_TYPE.BNPL_4PAY ||
        s.type === SERVICES_TYPE.BNPL_6PAY,
    );

    // 1. Rule for COIN service
    if (hasCoin) {
      steps.push('درصورت لغو اشتراک، امکان بازگشت وجه سکه‌های پی‌کلاب وجود نداشته و سکه‌هادر حساب شما باقی خواهند ماند.');
    }

    // 2.1 Rule for CREDIT / BNPL services
    if (hasCreditOrBnpl) {
      steps.push('تعداد دفعات لغو اشتراک خریداری شده داری محدودیت حداکثر ۱بار در روز، ۲بار در هفته و ۵ بار در ماه می باشد.');
    } else {
      // 2.2 Rule for services except CREDIT / BNPL
      steps.push('درصورت لغو اشتراک، دسترسی شما به اشتراک فعلی قطع می‌شود و دیگر قادر به استفاده از خدمات قابل استفاده نخواهید بود.');
    }

    // 3. Another rule for CREDIT / BNPL
    if (hasCreditOrBnpl) {
      steps.push('شما با تهیه‌ی اشتراک، فقط یک بار قادر به دریافت وام خواهید بود.');
    }

    // 4. Auto-expire rule (always present)
    steps.push(`این اشتراک پس از ${plan?.durationInMonth}ماه، به صورت خودکار غیرفعال می‌شود.`);

    this.rules.set({
      title: `قوانین و شرایط دریافت اشتراک ${plan?.title}:`,
      steps,
    });
  }

  onRulesTextClicked(event: MouseEvent): void {
    event.stopPropagation();
  }

  onRulesClicked(): void {
    this.ngxStateService.openBottomSheet({
      title: 'قوانین و شرایط',
      description: '',
      icon: 'info',
      type: 'Empty',
      htmlContent: this.rulesTemplate(),
      buttons: [
        {
          id: 'primary',
          mode: 'form',
          style: 'fill',
          fullWidth: true,
          label: 'متوجه شدم',
          size: 'medium',
        },
      ],
    });
  }
}
