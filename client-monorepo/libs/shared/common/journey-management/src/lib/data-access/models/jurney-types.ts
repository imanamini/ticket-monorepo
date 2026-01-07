import { ButtonIcon, ButtonMode, ButtonSize, ButtonStyle } from '@digipay/ngx-button';
import { NgxBadgeStatus } from '@digipay/ngx-badge/lib/ngx-badge.type';
import { Action } from './na-backend.interface';

export interface BaseJourney {
  title?: string;
  description?: string;
  secondaryDescription?: string;
  primaryAction: buttonConfig;
  secondaryActions: buttonConfig[];
  badges: Array<JourneyBadgeConfig>;
  stepper?: {
    title?: string;
    percentage: number;
  };
  image?: string;
  backgroundImage?: string;
  foregroundImage?: string;
}

export interface buttonConfig {
  text?: string;
  action?: Action;
  fullWidth?: boolean;
  mode?: ButtonMode;
  size?: ButtonSize;
  style?: ButtonStyle;
  brandButton?: boolean;
  destructive?: boolean;
  rightIcon?: ButtonIcon;
  leftIcon?: ButtonIcon;
}

export interface JourneyBadgeConfig {
  text: string;
  status?: NgxBadgeStatus;
  icon?: string;
}
