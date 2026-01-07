import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CreditDigipayImageComponent } from '../credit-digipay-image/credit-digipay-image.component';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-credit-navigation-card-v2',
  templateUrl: './credit-navigation-card-v2.component.html',
  styleUrls: ['./credit-navigation-card-v2.component.scss'],
  standalone: true,
  imports: [CreditDigipayImageComponent, NgxIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditNavigationCardV2Component {
  text = input<string>();
  imageId = input<string>();
}
