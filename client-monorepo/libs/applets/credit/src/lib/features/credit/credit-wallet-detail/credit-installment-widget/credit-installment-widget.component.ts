import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxIcon } from '@digipay/ngx-icon';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { getMonthTitle, getYear } from '../../data-access/utils/date';

type State = 'DueWithPenalty' | 'Due';
type Mode = 'multi' | 'single';

@Component({
  selector: 'app-credit-installment-widget',
  templateUrl: './credit-installment-widget.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgxButtonComponent, NgxIcon, PipesModule],
})
export class CreditInstallmentWidgetComponent {
  // Inputs
  state = input<State>('DueWithPenalty');
  count = input.required<number>();
  amount = input.required<number>();
  singleInstallmentDueDate = input<number>();
  ctaText = input<string>('مشاهده');

  // Signals
  mode = computed<Mode>(() => (this.count() > 1 ? 'multi' : 'single'));
  singleInstallmentDueDateTitle = computed(() => {
    if (this.singleInstallmentDueDate()) {
      return getMonthTitle(this.singleInstallmentDueDate()!, true) + getYear(this.singleInstallmentDueDate()!);
    } else {
      return '';
    }
  });

  // Outputs
  ctaClicked = output();
}
