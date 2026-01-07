import { Component, Input } from '@angular/core';
import { UiIconComponent } from '../../data-access/directives/ui-icon/ui-icon.component';
import { NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'card-notice',
  templateUrl: './card-notice.component.html',
  styleUrls: ['./card-notice.component.scss'],
  standalone: true,
  imports: [NgIf, UiIconComponent, NgFor, NgClass]
})
export class CardNoticeComponent {
  @Input() title: string;
  @Input() notices: Array<any>;
  @Input() hasDots = false;
  @Input() textKey: string;

  constructor() {
  }
}
