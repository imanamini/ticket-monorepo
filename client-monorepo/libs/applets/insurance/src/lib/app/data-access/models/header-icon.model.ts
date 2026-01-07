import { IconEnum } from '../enums/icon.enum';

export interface HeaderIconModel {
  name: IconEnum;
  clickHandler?: (e: Event) => void;
  class?: string;
}
