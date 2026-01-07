import { headerMode } from '../../../../ui/models/headerMode-type.model';

export interface navItemModel {
  title: string;
  icon: string;
  isActive: boolean;
  symbol: headerMode;
  subMenu: string[];
  link: string;
  hasHref: boolean;
  showBadge: boolean;
}
