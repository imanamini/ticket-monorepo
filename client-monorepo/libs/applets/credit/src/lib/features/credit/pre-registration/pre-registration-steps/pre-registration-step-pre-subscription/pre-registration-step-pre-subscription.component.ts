import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { PreRegistrationService } from '../../services/pre-registration.service';
import { ALLOCATION_PAYMENT_METHOD, PlanGroup } from '../../../data-access/models/credit/pre-registration/credit-plan-group';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { CreditScrollableViewComponent } from '../../../components/credit-scrollable-view/credit-scrollable-view.component';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-pre-registration-step-pre-subscription',
  templateUrl: './pre-registration-step-pre-subscription.component.html',
  styleUrls: ['./pre-registration-step-pre-subscription.component.scss'],
  imports: [
    NgxButtonComponent,
    ApiImageModule,
    NgxTrackableIdDirective,
    PipesModule,
    NgxDividerComponent,
    CreditScrollableViewComponent,
    CreditAppBarComponent,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreRegistrationStepPreSubscriptionComponent implements OnInit {
  loading = signal(false);
  plan = signal<PlanGroup | null>(null);
  steps = signal<string[]>([]);

  EnabledTwoAllocationPayment = computed(() => this.plan()?.allocationPaymentMethodType === ALLOCATION_PAYMENT_METHOD.PECUNIARY_CREDIT);

  protected readonly BorderColorsEnum = BorderColorsEnum;
  private preRegistrationService = inject(PreRegistrationService);

  ngOnInit(): void {
    this.plan.set(this.preRegistrationService.filteredPlans[0]);
  }

  goBack() {
    this.preRegistrationService.prevStep();
  }

  onSubmit() {
    this.loading.set(true);
    this.preRegistrationService.nextStep();
  }
}
