import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { CreditDigipayImageComponent } from '../credit-digipay-image/credit-digipay-image.component';

@Component({
  selector: 'app-credit-payment-card',
  templateUrl: './credit-payment-card.component.html',
  styleUrls: ['./credit-payment-card.component.scss'],
  standalone: true,
  imports: [CreditDigipayImageComponent, PipesModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditPaymentCardComponent {
  imageId = input<string>();

  amount = input<number>();

  details = input<string[]>([]);

  title = input('');

  detailsTitle = input('جزئیات هزینه');

  leftLabel = input<{
    title: string;
    value: string;
  }>();
}
