import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-credit-early-settlement-change-amount-header',
  standalone: true,
  imports: [NgxIcon, PipesModule],
  templateUrl: './credit-early-settlement-change-amount-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditEarlySettlementChangeAmountHeaderComponent {
  usedAmount = input<number | null>(null);
  showUsedAmount = input<boolean>(true);
  earlySettlementLabel = 'تسویه زودهنگام';
  usedCreditLabel = 'اعتبار مصرف شده';
}
