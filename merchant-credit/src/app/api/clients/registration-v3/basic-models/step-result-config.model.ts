import { ButtonMode, ButtonStyle } from '@digipay/ng-button/lib/models/types';

export interface StepConfigAction {
  title?: string;
  message?: string;
  subDescription?: string;
  buttons?: Buttons[],
  staticImage?: string;
  loading?: boolean;
  timer?: object;
}

export interface Buttons {
  id: string;
  buttonType?: string;
  buttonMode: ButtonMode;
  buttonStyle: ButtonStyle;
  label: string;
}
