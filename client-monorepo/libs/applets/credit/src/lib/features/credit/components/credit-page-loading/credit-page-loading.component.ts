import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';

@Component({
  selector: 'credit-page-loading',
  templateUrl: './credit-page-loading.component.html',
  styleUrls: ['./credit-page-loading.component.scss'],
  standalone: true,
  imports: [NgxSpinnerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditPageLoadingComponent {
  active = input<boolean>(false);
}
