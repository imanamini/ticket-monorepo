import { Component, Input } from '@angular/core';
import { CurrencyPipe } from '../../../ui-pipes/currency.pipe';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-ui-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss'],
  standalone: true,
  imports: [NgStyle, CurrencyPipe],
})
export class UiCurrencyComponent {
  @Input()
  value: number | string;

  @Input()
  fontSize = '14px';

  @Input()
  unitFontSize = 'smaller';

  @Input()
  fontWeight = '200';
}
