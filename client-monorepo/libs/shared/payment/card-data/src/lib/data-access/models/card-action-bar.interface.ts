import { CardActionButton } from './card-action-button.interface';

export interface CardActionBar {
  value?: string;
  textColor?: string;
  action?: CardActionButton;
  leftAction?: CardActionButton;
  rightAction?: CardActionButton;
}
