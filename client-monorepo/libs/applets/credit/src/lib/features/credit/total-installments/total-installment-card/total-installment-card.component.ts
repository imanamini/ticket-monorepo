import { Component, computed, input, output } from '@angular/core';
import { getMonthTitle, isStartAndEndOfMonth } from '../../data-access/utils/date';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { ClickStopPropagationDirective } from '../../data-access/directives/stop-propagation-directive';
import { CreditCheckboxComponent } from '../../components/credit-checkbox/credit-checkbox.component';

interface BillingCycleDate {
  startDate: number;
  endDate: number;
}

@Component({
  selector: 'app-total-installment-card',
  templateUrl: './total-installment-card.component.html',
  styleUrl: './total-installment-card.component.scss',
  standalone: true,
  imports: [CreditCheckboxComponent, ClickStopPropagationDirective, NgxBadgeModule, NgxIcon, NgxButtonComponent, PipesModule],
})
export class TotalInstallmentCardComponent {
  contractTrackingCode = input<string | null>(null);
  selected = input<boolean>(false);
  isLocked = input<boolean>(false);
  billingCycleDate = input<BillingCycleDate | null>(null);
  installmentsCount = input<number>();
  installmentOrder = input<number>();
  dueDate = input<number>();
  totalAmount = input<number>();
  penaltyAmount = input<number>(0);
  penaltyWaiverAmount = input<number>(0);

  onCheckedChange = output<boolean>();
  onShowDetail = output();
  onLockedClick = output();

  title = computed<string>(() => {
    const alongAMonth = isStartAndEndOfMonth(this.billingCycleDate()?.startDate!, this.billingCycleDate()?.endDate!);

    if (this.billingCycleDate()) {
      if (alongAMonth) {
        return 'خریدهای ' + getMonthTitle(this.billingCycleDate()?.startDate!);
      } else {
        return (
          'خریدهای ' +
          getMonthTitle(this.billingCycleDate()?.startDate!, true) +
          ' تا ' +
          getMonthTitle(this.billingCycleDate()?.endDate!, true)
        );
      }
    } else {
      return '';
    }
  });
  installmentOrderTitle = computed<string>(() =>
    this.installmentsCount() === 1 ? 'تک قسطه' : 'قسط ' + this.installmentOrder() + ' از ' + this.installmentsCount(),
  );

  id = computed<string>(() => this.contractTrackingCode()! + this.installmentOrder());

  checkHandler($event: boolean) {
    this.onCheckedChange.emit($event);
  }

  cardClickHandler() {
    if (this.isLocked()) {
      this.onLockedClick.emit();
    } else {
      this.checkHandler(!this.selected());
    }
  }
}
