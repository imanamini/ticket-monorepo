import { Component, Input, TemplateRef } from '@angular/core';
import { NgClass, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-ui-basic-segment',
  templateUrl: './ui-basic-segment.component.html',
  styleUrls: ['./ui-basic-segment.component.scss'],
  standalone: true,
  imports: [NgClass, NgTemplateOutlet],
})
export class UiBasicSegmentComponent {
  @Input()
  title: string | undefined = '';

  @Input()
  rtl = false;

  @Input()
  figure!: TemplateRef<any>;

  @Input()
  content!: TemplateRef<any>;
}
