import { IconEnum } from '../enums/icon.enum';

export interface InsCarouselListItemModel {
  title: string;
  icon: IconEnum | string;
  url?: string;
}
