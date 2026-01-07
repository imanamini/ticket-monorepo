import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';

@Component({
  selector: 'app-credit-notices',
  templateUrl: './credit-notices.component.html',
  styleUrls: ['./credit-notices.component.scss'],
  imports: [NgxDividerComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditNoticesComponent {
  notices = input<string[]>([]);
  title = input('');

  protected readonly BorderColorsEnum = BorderColorsEnum;
}
