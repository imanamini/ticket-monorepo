import { Component, input } from '@angular/core';
import { NgxTooltipDirective } from '@digipay/ngx-tooltip';

@Component({
  selector: 'detail-item',
  standalone: true,
  imports: [
    NgxTooltipDirective
  ],
  templateUrl: './detail-item.component.html',
  styleUrl: './detail-item.component.scss'
})
export class DetailItemComponent {
  id = input<string>();
  title = input.required<string>();
  value = input.required<string>();
}
