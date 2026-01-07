import { ButtonSelectItemTypeEnum } from '../enums/button-select-item-type.enum';
import { ButtonSelectListItemModel } from './button-select-list-item.model';

export interface ButtonSelectListItemsModel {
  title?: string;
  searchInputPlaceHolder?: string;
  searchable: boolean;
  type: ButtonSelectItemTypeEnum;
  isDivider: boolean;
  buttonText: string;
  items: ButtonSelectListItemModel[];
}
