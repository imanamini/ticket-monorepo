import { DecimalPipe } from '@angular/common';
import { IPriceUnitProps } from '../../models';
import { Component, input } from '@angular/core';
import { NgxTooltipDirective } from '@digipay/ngx-tooltip';
import { NgxBadgeModule } from '@digipay/ngx-badge';

@Component({
  selector: 'app-price-unit',
  templateUrl: './price-unit.component.html',
  styleUrls: ['./price-unit.component.scss'],
  standalone: true,
  imports: [DecimalPipe, NgxTooltipDirective, NgxBadgeModule],
})
export class PriceUnitComponent {
  props = input.required<IPriceUnitProps>();
}
