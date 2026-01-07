import { Component, Input } from '@angular/core';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { UiIconDirective } from '../../ui-directive/ui-icon.directive';

@Component({
  selector: 'app-ui-card-notice',
  templateUrl: './ui-card-notice.component.html',
  styleUrls: ['./ui-card-notice.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, NgClass, UiIconDirective],
})
export class UiCardNoticeComponent {
  @Input() title: string;

  @Input() notices: Array<{
    text: string;
  }>;

  @Input() hasDots = false;
}
