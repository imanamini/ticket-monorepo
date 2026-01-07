import { Component, Input } from '@angular/core';
import { GridWidgetPayload } from '../../../data-access/models/grid-widget';
import { BaseWidgetComponent } from '../../base-widget/base-widget.component';

@Component({
  selector: 'common-widget-loader-grid-widget',
  templateUrl: './grid-widget.component.html',
  styleUrl: './grid-widget.component.scss',
})
export class GridWidgetComponent extends BaseWidgetComponent {
  @Input() payload?: GridWidgetPayload;
}
