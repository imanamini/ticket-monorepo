import { Component, input, Type } from '@angular/core';
import { WidgetType } from '../../data-access/models/widget-type';
import { GridWidgetComponent } from '../../components/widgets/grid/grid-widget.component';
import { TextWidgetComponent } from '../../components/widgets/text/text-widget.component';
import { BaseWidgetComponent } from '../../components/base-widget/base-widget.component';
import { Widget } from '../../data-access/models/widget';
import { NothingWidgetComponent } from '../../components/widgets/nothing/nothing-widget.component';

@Component({
  selector: 'common-widget-loader',
  templateUrl: './widget-loader.component.html',
  styleUrl: './widget-loader.component.scss',
})
export class WidgetLoaderComponent {
  widget = input<Widget>({
    type: WidgetType.NOTHING,
    payload: null,
  });
  componentMap: { [key in WidgetType]: Type<BaseWidgetComponent> } = {
    [WidgetType.NOTHING]: NothingWidgetComponent,
    [WidgetType.GRID]: GridWidgetComponent,
    [WidgetType.TEXT]: TextWidgetComponent,
  };
}
