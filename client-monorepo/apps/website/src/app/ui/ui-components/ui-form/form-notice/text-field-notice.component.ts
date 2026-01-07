import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-ui-form-notice',
  templateUrl: './text-field-notice.component.html',
  styleUrls: ['./text-field-notice.component.scss'],
  standalone: true,
  imports: [NgClass],
})
export class FormNoticeComponent {
  @Input()
  visible = false;

  @Input()
  appearance: 'error' | 'hint' | 'success';
}
