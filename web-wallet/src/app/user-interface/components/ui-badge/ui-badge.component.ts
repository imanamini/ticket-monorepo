import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-badge',
  templateUrl: './ui-badge.component.html',
  styleUrls: ['./ui-badge.component.scss']
})
export class UiBadgeComponent {

  @Input()
  percentage: number | string;

  @Input()
  label: string;

  @Input()
  appearance: 'default' | 'red' | 'green' = 'default';

  get className() {
    return this.appearance;
  }
}
