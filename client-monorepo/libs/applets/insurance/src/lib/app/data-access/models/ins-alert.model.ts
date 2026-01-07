import { AlertActionButtonModel } from './alert-action-button.model';
import { AlertColorEnum } from '../enums/alert-color.enum';
import { AlertSizeEnum } from '../enums/alert-size.enum';

export interface InsAlertModel {
  title?: string;
  text: string;
  color?: AlertColorEnum;
  size?: AlertSizeEnum;
  hasIcon?: boolean;
  hasCloseIcon?: boolean;
  actionButton?: AlertActionButtonModel;
}
