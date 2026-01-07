import { NgxBadgeSize } from '@digipay/ngx-badge/lib/ngx-badge.type';

export interface ProductPreviewSizeVariantsModel {
  wrapperClasses: string;
  imageWrapperClasses: string;
  storeNameClasses: string;
  productTitleClasses: string;
  productPriceClasses: string;
  installmentPrice: string;
  installmentUnit: string;
  installmentBadgeSize: string;
  installmentBadgeTitleFont: string;
  installmentBadgeTitleHeight: string;
  installmentBadgeSubtitleFont: string;
  installmentBadgeSubtitleHeight: string;
  titleHeight: string;
  badgeSize: NgxBadgeSize;
  badgeFontSize: string;
}
