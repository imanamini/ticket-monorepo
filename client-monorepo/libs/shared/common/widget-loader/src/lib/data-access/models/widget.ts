import { GridWidget } from './grid-widget';
import { TextWidget } from './text-widget';
import { NothingWidget } from './nothing-widget';

export type Widget = NothingWidget | GridWidget | TextWidget;
