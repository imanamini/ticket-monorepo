import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TextValue } from '../../../data-access/models/credit/installment/text-value';
import { CreditDigipayImageComponent } from '../../../components/credit-digipay-image/credit-digipay-image.component';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-credit-purchase-group-card',
  templateUrl: './credit-purchase-group-card.component.html',
  styleUrls: ['./credit-purchase-group-card.component.scss'],
  standalone: true,
  imports: [CreditDigipayImageComponent, NgxIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditPurchaseGroupCardComponent {
  imageId = input<string>();
  merchantName = input<TextValue>();
  totalAmount = input<TextValue>();
}
