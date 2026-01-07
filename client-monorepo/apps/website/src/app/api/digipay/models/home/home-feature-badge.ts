import { HOME_ICON_BADGE_POSITION } from './home-icon-badge-position';
import { HOME_ICON_BADGE_TYPE } from './home-icon-badge-type';

export interface HomeFeatureBadge {
  uid: string;
  type: HOME_ICON_BADGE_TYPE;
  position: HOME_ICON_BADGE_POSITION;
  value: string;
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  stateful: boolean;
}
