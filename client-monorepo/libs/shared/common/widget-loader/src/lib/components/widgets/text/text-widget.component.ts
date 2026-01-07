import { Component, input } from '@angular/core';
import { TextWidgetPayload } from '../../../data-access/models/text-widget';
import { BaseWidgetComponent } from '../../base-widget/base-widget.component';

@Component({
  selector: 'common-widget-loader-text-widget',
  standalone: true,
  templateUrl: './text-widget.component.html',
  styleUrl: './text-widget.component.scss',
})
export class TextWidgetComponent extends BaseWidgetComponent {
  payload = input<TextWidgetPayload>();
}
