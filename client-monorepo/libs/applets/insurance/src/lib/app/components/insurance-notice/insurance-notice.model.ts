import { InsButtonStyleEnum } from '../../data-access/enums/ins-button-style.enum';

export interface InsuranceNoticeModel {
  title: string;
  text: string;
  activeButtonText: string;
  activeButtonMode?: InsButtonStyleEnum;
  deActiveButtonText: string;
  mode?: 'warning' | 'error';
}
