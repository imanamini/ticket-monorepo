import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
  standalone: true,
})
export class TabComponent {
  @Input('tabTitle') title!: string;
  @Input() active = false;
  @Input() id!: number;
  @Input() name = '';
  @Input() isDisabled = false;
  @Input() badgeText = '';
}
