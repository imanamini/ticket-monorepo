import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { NgxTooltipDirective } from '@digipay/ngx-tooltip';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { NgxIcon } from '@digipay/ngx-icon';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';
import { PreRegistrationService } from '../../services/pre-registration.service';
import { PlanGroup } from '../../../data-access/models/credit/pre-registration/credit-plan-group';
import { CreditScrollableViewComponent } from '../../../components/credit-scrollable-view/credit-scrollable-view.component';
import { NgxCheckboxComponent } from '@digipay/ngx-checkbox';

@Component({
  selector: 'app-pre-registration-step-conditions-plan',
  templateUrl: './pre-registration-step-conditions-plan.component.html',
  styleUrls: ['./pre-registration-step-conditions-plan.component.scss'],
  imports: [
    NgxTooltipDirective,
    NgxButtonComponent,
    NgxTrackableIdDirective,
    NgxIcon,
    CreditAppBarComponent,
    CreditScrollableViewComponent,
    NgxCheckboxComponent,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreRegistrationStepConditionsPlanComponent implements OnInit {
  loading = signal(false);
  plan = signal<PlanGroup | null>(null);
  acceptedCondition = signal<boolean>(false);
  conditions = computed(() => {
    const plan = this.plan();

    return (
      plan?.details?.map((item) => ({
        title: item.description.body,
        description: item.description.info?.description,
      })) ?? []
    );
  });

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
