import { BadgeStatusEnum } from '../enums/badge-status.enum';
import { SectionDetailItemModel } from './section-detail-item.model';
import { InsAlertModel } from './ins-alert.model';

export interface SectionDetailCardModel {
  title: string;
  subtitle?: string;
  descriptions?: SectionDetailItemModel[];
  icon?: string;
  iconSize?: number;
  defaultIcon?: string;
  badge?: string;
  badgeStatus?: BadgeStatusEnum;
  details: SectionDetailItemModel[];
  expandable?: boolean;
  expanded?: boolean;
  border?: boolean;
  alert?: InsAlertModel;
}
