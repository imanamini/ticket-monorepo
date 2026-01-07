import { NgxBadgeMode, NgxBadgeStatus } from '@digipay/ngx-badge/lib/ngx-badge.type';

export interface SlideSectionBannerExtractedDataModel {
  image: string;
  altText?: string;
  badge: Badge;
  title: string;
  subTitleNormal: string;
  divider: boolean;
}

export interface Badge {
  text: string;
  status: NgxBadgeStatus;
  mode: NgxBadgeMode;
}
