import { UsedHeaderActionButtonModel } from './used-header-action-button.model';

export interface UsedHeaderDataModel {
  headerTitle?: string;
  customIcon?: string;
  backBtnIcon?: string;
  showBackBtn: boolean;
  actionButtons?: UsedHeaderActionButtonModel[];
  backClickHandler?: () => void;
}
