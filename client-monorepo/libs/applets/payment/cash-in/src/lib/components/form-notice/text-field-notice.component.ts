import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'cash-in-applet-form-notice',
  templateUrl: './text-field-notice.component.html',
  styleUrls: ['./text-field-notice.component.scss'],
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormNoticeComponent {
  @Input()
  visible = false;

  @Input()
  appearance!: 'error' | 'hint';
}
