import { Component, computed, input } from '@angular/core';
import { PipesModule } from '@digipay/ng-lib-pipes';

@Component({
  selector: 'app-bnpl-pay-cash-card',
  standalone: true,
  imports: [
    PipesModule
  ],
  templateUrl: './bnpl-pay-cash-card.component.html',
  styleUrl: './bnpl-pay-cash-card.component.scss'
})
export class BnplPayCashCardComponent {
  totalAmount = input<number>(0);
  prePaymentAmount = input<number>(0);
  fee = input<number>(0);

  remainedAmount = computed<number>(() =>
    this.totalAmount() - this.prePaymentAmount() - this.fee()
  );
}
