import { Component, computed, input, output } from '@angular/core';
import { getMonthTitle } from '../../../../utils/date';
import { PipesModule } from '@digipay/ng-lib-pipes';

@Component({
  selector: 'app-bnpl-pay-combined-card',
  standalone: true,
  imports: [
    PipesModule,
  ],
  templateUrl: './bnpl-pay-combined-card.component.html',
  styleUrl: './bnpl-pay-combined-card.component.scss'
})
export class BnplPayCombinedCardComponent {
  cashAmount = input<number>(null);
  creditAmount = input<number>(null);
  effectiveDate = input<number>(null);

  formattedEffectiveDate = computed(() => getMonthTitle(this.effectiveDate(), true));

  onEditCredit = output();
}
