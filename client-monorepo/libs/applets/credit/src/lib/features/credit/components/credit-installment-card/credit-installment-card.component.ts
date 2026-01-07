import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { CreditDigipayImageComponent } from '../credit-digipay-image/credit-digipay-image.component';

@Component({
  selector: 'app-credit-installment-card',
  templateUrl: './credit-installment-card.component.html',
  styleUrls: ['./credit-installment-card.component.scss'],
  standalone: true,
  imports: [CreditDigipayImageComponent, PipesModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditInstallmentCardComponent {
  amount = input<number>();

  netAmount = input<number>();

  penaltyAmount = input<number>();

  imageId = input<string>();

  title = input<string>();

  date = input<string>();

  color = input<string>();
}
