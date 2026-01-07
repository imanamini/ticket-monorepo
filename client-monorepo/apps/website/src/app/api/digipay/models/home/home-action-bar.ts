import { HomeActionButton } from './home-action-button';

export interface HomeActionBar {
  value?: string;
  textColor?: string;
  action?: HomeActionButton;
  leftAction?: HomeActionButton;
  rightAction?: HomeActionButton;
}
