import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'payment-checkout-amount-label-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-amount-label-bar.component.html',
  styleUrls: ['./ui-amount-label-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AmountLabelBarComponent {
  title = input<string>('');
  value = input<string | number>('');
  currency = input<string>('ریال');
  theme = input<'light' | 'warning'>('light');
  userFullName = input<string>();

  getClass() {
    return `theme-${this.theme()}`;
  }

  toLocalStorage(num: number | string) {
    if (typeof num === 'number') {
      return num.toLocaleString();
    } else {
      return +num.toLocaleString();
    }
  }
}
