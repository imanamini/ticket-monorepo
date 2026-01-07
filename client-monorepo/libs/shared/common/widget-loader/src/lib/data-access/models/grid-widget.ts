import { WidgetType } from './widget-type';
import { Widget } from './widget';

export interface GridWidgetPayload {
  rows: RowWidgetPayload[];
}

export interface RowWidgetPayload {
  columns: ColWidgetPayload[];
}

export interface ColWidgetPayload {
  widgets: Widget[];
  width: number;
}

export interface GridWidget {
  type: WidgetType.GRID;
  payload: GridWidgetPayload;
}
