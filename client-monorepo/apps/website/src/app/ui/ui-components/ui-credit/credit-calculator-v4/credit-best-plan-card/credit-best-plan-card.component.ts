import { Component, computed, inject, input } from '@angular/core';
import { PlanGroup } from '../../../../models/credit/credit-plan-group';
import { UiIconDirective } from '../../../../ui-directive/ui-icon.directive';
import { SubscriptionType } from '../../../../models/credit/subscription-detail.model';
import { UiDialogSubscriptionDetailsComponent } from '../../../ui-dialogs/ui-dialog-subscription-details/ui-dialog-subscription-details.component';
import { DialogBottomSheetService } from '../../../../../core/services/dialog-bottom-sheet.service';
import { ArrayUtils } from '../array-utils';
import { PipesModule } from '@digipay/ng-lib-pipes';

interface PlanDetail {
  totalInstallmentAmount: number;
  installmentAmount: number;
  subscriptionAmount: number;
  collaterals: string[];
  collateralDescription: string;
  subscriptionName: string;
  subscriptionType?: SubscriptionType;
  totalRepaymentAmount: number;
}

@Component({
  selector: 'app-credit-best-plan-card',
  templateUrl: './credit-best-plan-card.component.html',
  styleUrls: ['./credit-best-plan-card.component.scss'],
  standalone: true,
  imports: [UiIconDirective, PipesModule],
})
export class CreditBestPlanCardComponent {
  plans = input.required<PlanGroup[]>();
  dialog = inject(DialogBottomSheetService);

  dataToShow = computed<PlanDetail>(() => {
    const output: PlanDetail = {
      totalInstallmentAmount: Number.MAX_VALUE,
      installmentAmount: Number.MAX_VALUE,
      subscriptionAmount: Number.MAX_VALUE,
      collaterals: [],
      collateralDescription: '',
      subscriptionName: '',
      totalRepaymentAmount: Number.MAX_VALUE,
    };
    this.plans().forEach((plan) => {
      output.totalInstallmentAmount = Math.min(plan.sumInstallmentAmount, output.totalInstallmentAmount);
      output.installmentAmount = Math.min(plan.installmentAmount, output.installmentAmount);
      output.subscriptionAmount = Math.min(plan.subscriptionDetail.amount, output.subscriptionAmount);
      output.totalRepaymentAmount = Math.min(plan.payableAmount, output.totalRepaymentAmount);
      output.collaterals.push(plan.collateralDto.name);
      output.subscriptionName = plan.subscriptionDetail.title;
      output.subscriptionType = plan.subscriptionDetail.type;
    });
    output.collateralDescription = ArrayUtils.removeDuplicates(output.collaterals).join(' یا ');
    return output;
  });

  detailsRows = computed<{ title: string; value: { type: 'price' | 'text'; value: number | string } }[]>(() => {
    const details: { title: string; value: { type: 'price' | 'text'; value: number | string } }[] = [];
    if (this.dataToShow().totalInstallmentAmount) {
      details.push({
        title: 'مجموع اقساط',
        value: {
          value: this.dataToShow().totalInstallmentAmount,
          type: 'price',
        },
      });
    }

    if (this.dataToShow().installmentAmount) {
      details.push({
        title: 'مبلغ هر قسط',
        value: {
          value: this.dataToShow().installmentAmount,
          type: 'price',
        },
      });
    }

    if (this.dataToShow().subscriptionAmount) {
      details.push({
        title: 'هزینه اشتراک',
        value: {
          value: this.dataToShow().subscriptionAmount,
          type: 'price',
        },
      });
    }

    if (this.dataToShow().collateralDescription) {
      details.push({
        title: 'ضمانت',
        value: {
          value: this.dataToShow().collateralDescription,
          type: 'text',
        },
      });
    }

    return details;
  });

  showSubscriptionInfo(subscriptionTitle: string, subscriptionType: SubscriptionType) {
    this.dialog.open(UiDialogSubscriptionDetailsComponent, {
      width: '588px',
      templateData: {
        subscriptionType: subscriptionType,
        subscriptionTitle: subscriptionTitle,
        title: 'اشتراک ' + subscriptionTitle + ' دیجی‌پی',
      },
    });
  }
}
