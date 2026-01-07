import { UsedHeaderButtonModes } from './used-header-button.modes';

export interface UsedHeaderActionButtonModel {
  clickHandler?: () => void;
  text?: string;
  icon?: string;
  mode?: UsedHeaderButtonModes;
}
