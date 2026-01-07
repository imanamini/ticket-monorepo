import { WidgetType } from './widget-type';

export interface TextWidgetPayload {
  title: string;
  content: string;
}

export interface TextWidget {
  type: WidgetType.TEXT;
  payload: TextWidgetPayload;
}
