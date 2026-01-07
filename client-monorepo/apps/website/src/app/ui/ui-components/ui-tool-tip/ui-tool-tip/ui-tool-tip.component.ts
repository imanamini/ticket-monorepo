import { Component, Input, TemplateRef } from '@angular/core';
import { NgIf, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-ui-tool-tip',
  templateUrl: './ui-tool-tip.component.html',
  styleUrls: ['./ui-tool-tip.component.scss'],
  standalone: true,
  imports: [NgIf, NgTemplateOutlet],
})
export class UiToolTipComponent {
  @Input() toolTip: TemplateRef<any>;
  @Input() show = false;
}
