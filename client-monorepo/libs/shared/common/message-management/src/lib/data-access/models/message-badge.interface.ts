import { BadgeType, NgxBadgeMode, NgxBadgeStatus } from '@digipay/ngx-badge/lib/ngx-badge.type';

export interface MessageBadgeInterface {
  mode: NgxBadgeMode;
  status: NgxBadgeStatus;
  text: string;
  type: BadgeType;
}
