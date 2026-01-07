import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import { NgStyle } from '@angular/common';
import { PipesModule } from '@digipay/ng-lib-pipes';

@Component({
  selector: 'cash-in-applet-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss'],
  imports: [NgStyle, PipesModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyComponent {
  @Input()
  value!: string;

  @Input()
  fontSize = '14px';
}
