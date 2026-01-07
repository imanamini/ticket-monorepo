import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CreditDigipayImageComponent } from '../../components/credit-digipay-image/credit-digipay-image.component';

@Component({
  selector: 'app-credit-wallet-detail-full-message',
  templateUrl: './credit-wallet-detail-full-message.component.html',
  styleUrls: ['./credit-wallet-detail-full-message.component.scss'],
  standalone: true,
  imports: [CreditDigipayImageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditWalletDetailFullMessageComponent {
  description = input<string>();
  imageId = input<string>();
}
