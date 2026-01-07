import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { PreRegistrationService } from '../../services/pre-registration.service';
import { ALLOCATION_PAYMENT_METHOD, PlanGroup } from '../../../data-access/models/credit/pre-registration/credit-plan-group';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { NgxCard } from '@digipay/ngx-card';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { CreditScrollableViewComponent } from '../../../components/credit-scrollable-view/credit-scrollable-view.component';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';
import { CREDIT_ENVIRONMENT, CreditEnvironmentInterface } from '../../../credit-environment.interface';
import { NgxAlert } from '@digipay/ngx-alert';

interface AccordionModel {
  id: string;
  title: string;
  badge?: string;
  isOpen: boolean;
  description: string;
}

@Component({
  selector: 'app-pre-registration-step-subscription',
  templateUrl: './pre-registration-step-subscription.component.html',
  styleUrls: ['./pre-registration-step-subscription.component.scss'],
  imports: [
    NgxButtonComponent,
    ApiImageModule,
    NgxDividerComponent,
    NgxCard,
    NgxTrackableIdDirective,
    PipesModule,
    CreditScrollableViewComponent,
    CreditAppBarComponent,
    NgxAlert,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreRegistrationStepSubscriptionComponent implements OnInit {
  plan = signal<PlanGroup | null>(null);
  steps = signal<string[]>([]);
  loading = signal(false);

  accordions = signal<AccordionModel[]>([
    {
      id: 'first',
      title: 'اشتراک چیست؟',
      description:
        'اشتراک دیجی‌پی یک طرح است که دسترسی به خدمات و مزایای ویژه‌ای مانند (دسترسی به اعتبار، ارسال رایگان مدارک، تخفیف بیمه و غیره) را برای مدت مشخصی فراهم می‌کند.',
      isOpen: false,
    },
    {
      id: 'second',
      title: 'چطور اشتراک بگیرم؟',
      description:
        'پس از گذراندن مراحل ثبت‌نام دریافت وام، در آخرین مرحله اگر اشتراک مورد نیاز طرح انتخاب شده را نداشتید،  لازم است اشتراک دیجی‌پی را خریداری کنید تا بتوانید از خدمات وام استفاده کنید.',
      isOpen: false,
    },
  ]);

  allocationPaymentMethodText = computed(
    () =>
      '<b>به صورت نقدی</b>' +
      (this.plan()?.allocationPaymentMethodType === ALLOCATION_PAYMENT_METHOD.PECUNIARY_CREDIT ? ' یا <b>کسر از وام</b>' : ''),
  );

  protected readonly BorderColorsEnum = BorderColorsEnum;
  private preRegistrationService = inject(PreRegistrationService);
  public creditEnvironment = inject<CreditEnvironmentInterface>(CREDIT_ENVIRONMENT);
  protected readonly isPillar = inject(CREDIT_ENVIRONMENT).creditEnv === 'pillar';

  fundProviderIconId = computed(() => {
    const iconId = this.plan()?.fundProvider?.icon;
    if (!iconId) return '';
    return this.isPillar ? `${iconId}` : iconId;
  });

  ngOnInit(): void {
    this.plan.set(this.preRegistrationService.filteredPlans[0]);
  }

  goBack() {
    this.preRegistrationService.prevStep();
  }

  changeAccordionState(id: string) {
    this.accordions.update((items) =>
      items.map((item) => {
        if (item.id === id) {
          item.isOpen = !item.isOpen;
        } else {
          item.isOpen = false;
        }
        return item;
      }),
    );
  }

  onSubmit() {
    this.loading.set(true);
    this.preRegistrationService.nextStep();
  }
}
