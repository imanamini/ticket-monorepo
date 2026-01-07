import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss']
})
export class UiCurrencyComponent {

  @Input()
  value: string | number;

  @Input()
  customColor: string;
}
