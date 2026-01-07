import { WidgetType } from './widget-type';

export interface NothingWidget {
  type: WidgetType.NOTHING;
  payload: null | undefined;
}
