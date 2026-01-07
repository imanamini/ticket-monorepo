import { AlertActionButtonTypeEnum } from '../enums/alert-action-button-type.enum';
import { AlertActionButtonAlignEnum } from '../enums/alert-action-button-align.enum';

export interface AlertActionButtonModel {
  type: AlertActionButtonTypeEnum;
  text: string;
  align: AlertActionButtonAlignEnum;
}
