import { ChangeDetectionStrategy, Component, input, model, output, signal } from '@angular/core';

import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgStyle } from '@angular/common';
import { PlanGroup } from '../../../data-access/models/credit/pre-registration/credit-plan-group';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { CreditScrollableViewComponent } from '../../../components/credit-scrollable-view/credit-scrollable-view.component';
import { CreditDigipayImageComponent } from '../../../components/credit-digipay-image/credit-digipay-image.component';

const COLLATERAL_TYPE_PRIORITY = [
  'NEW_CHEQUE',
  'OLD_CHEQUE',
  'INSTALLMENT_CHEQUE',
  'E_NOTE',
  'PHYSICAL_NOTE',
  'BASED_ON_SCORE',
  'UN_PAYABLE',
];

@Component({
  selector: 'app-credit-scoring-step-result-suggested-plans',
  standalone: true,
  imports: [PipesModule, NgStyle, NgxButtonComponent, CreditScrollableViewComponent, CreditDigipayImageComponent],
  templateUrl: './credit-scoring-step-result-suggested-plans.component.html',
  styleUrl: './credit-scoring-step-result-suggested-plans.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditScoringStepResultSuggestedPlansComponent {
  loading = input(false);
  plans = model<PlanGroup[]>([]);
  selectedPlan = signal<PlanGroup | null>(null);
  confirmPlan = output<PlanGroup>();

  selectPlan(planId: string) {
    this.plans.update((plans) =>
      plans.map((plan) => {
        if (plan.planId === planId) {
          this.selectedPlan.set(plan);
          plan.isSelected = true;
        } else {
          plan.isSelected = false;
        }
        return plan;
      }),
    );
  }
}
