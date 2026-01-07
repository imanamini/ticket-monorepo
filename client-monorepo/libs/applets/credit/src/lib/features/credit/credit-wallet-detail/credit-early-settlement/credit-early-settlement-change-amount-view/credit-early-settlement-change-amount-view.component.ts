import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'app-credit-early-settlement-change-amount-view',
  standalone: true,
  imports: [NgxButtonComponent, PipesModule],
  templateUrl: './credit-early-settlement-change-amount-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditEarlySettlementChangeAmountViewComponent {
  amountView = input<number | null>(null);

  amountPayableLabel = 'مبلغ قابل پرداخت';
  editButtonLabel = 'ویرایش';
  acceptAndPayButtonLabel = 'تایید و پرداخت';

  editAmountClicked = output<void>();
  acceptAndPayClicked = output<void>();

  handleEditAmountClick() {
    this.editAmountClicked.emit();
  }

  handleAcceptAndPayClick(): void {
    this.acceptAndPayClicked.emit();
  }
}
