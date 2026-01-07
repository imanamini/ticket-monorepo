import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-amount-label-bar',
  templateUrl: './ui-amount-label-bar.component.html',
  styleUrls: ['./ui-amount-label-bar.component.scss']
})
export class UiAmountLabelBarComponent {

  @Input()
  title: string;

  @Input()
  value: number | string;

  @Input()
  currency = 'ریال';

  @Input()
  theme: 'light' | 'warning' = 'light';

  @Input()
  userFullName: string;

  getClass() {
    return `theme-${this.theme}`;
  }

  toLocalStorage(num: number | string) {
    if (typeof num === 'number') {
      return num.toLocaleString();
    } else {
      return +num.toLocaleString();
    }
  }

}
