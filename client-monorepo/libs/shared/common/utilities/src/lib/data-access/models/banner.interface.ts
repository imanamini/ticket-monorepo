import { Slide } from './slide.interface';
import { BannerCategory } from './banner-category';
import { BannerType } from './banner-type';
import { ConfigSectionBannerExtractedData } from './config-types/config-section-banner-extracted-data.model';
import { MerchantCarouselConfig } from './config-types/merchant-carousel-config.interface';
import { PromotionCarouselConfig } from './config-types/promotion-carousel-config.interface';
import { PromotionListConfig } from './config-types/promotion-list-config.interface';
import { SelectedMerchantConfig } from './config-types/selected-merchant-config.interface';
import { HorizontalMediumCarouselConfig } from './config-types/horizontal-medium-carousel-config.interface';
import { MostVisitedPostsConfig } from './config-types/most-visited-posts-config.interface';
import { TimerBannerConfig } from './config-types/timer-banner-config';
import { SocialPageCarouselBannerConfig } from './config-types/social-page-carousel-banner.config';
import { ThirdPartyCarouselConfig } from './config-types/third-party-carousel-config.interface';

export interface BaseBanner {
  uuid: string;
  title: string;
  order: number;
  categories: BannerCategory[];
  active: boolean;
  type: BannerType;
  slides: Slide[];
  config?: string; // JSON
  extractedConfig: any;
  geoRestricted?: boolean;
  startTime?: number;
  endTime?: number;
}

export interface CarouselBanner extends BaseBanner {
  type: 'Carousel';
}

export interface PartialViewBanner extends BaseBanner {
  type: 'Partial-View-Carousel';
}

export interface SingleImageBanner extends BaseBanner {
  type: 'Single-Image';
}

export interface SectionBanner extends BaseBanner {
  type: 'Section-Banner';
  extractedConfig: ConfigSectionBannerExtractedData;
}

export interface MerchantCarouselBanner extends BaseBanner {
  type: 'Merchant-Carousel';
  extractedConfig: MerchantCarouselConfig;
}

export interface PromotionCarouselBanner extends BaseBanner {
  type: 'Promotion-Carousel';
  extractedConfig: PromotionCarouselConfig;
}

export interface PromotionListBanner extends BaseBanner {
  type: 'Promotion-List';
  extractedConfig: PromotionListConfig;
}

export interface SelectedMerchantsBanner extends BaseBanner {
  type: 'Selected-Merchants';
  extractedConfig: SelectedMerchantConfig;
}

export interface HorizontalMediumCarouselBanner extends BaseBanner {
  type: 'Horizontal-Medium-Carousel';
  extractedConfig: HorizontalMediumCarouselConfig;
}

export interface GridImageBanner extends BaseBanner {
  type: 'Grid-Image';
}

export interface VoucherCarousel extends BaseBanner {
  type: 'Voucher-Carousel';
}

export interface ThirdPartyCarousel extends BaseBanner {
  type: 'Third-Party-Carousel';
  extractedConfig: ThirdPartyCarouselConfig;
}

export interface MostVisitedPosts extends BaseBanner {
  type: 'Most-Visited-Post';
  extractedConfig: MostVisitedPostsConfig;
}

export interface TimerBanner extends BaseBanner {
  type: 'Timer-Banner';
  extractedConfig: TimerBannerConfig;
}

export interface NewestMerchantInstagram extends BaseBanner {
  type: 'Newest-Merchant-Instagram';
  extractedConfig: { trackingCodes: string[] };
}

export interface MallCarousel extends BaseBanner {
  type: 'Mall-Carousel';
}

export interface PostCarouselBanner extends BaseBanner {
  type: 'Post-Carousel';
  extractedConfig: { promotionGroup: string };
}

export interface RecentlyViewed extends BaseBanner {
  type: 'Last-Recently-Views';
}

export interface MostValuableProducts extends BaseBanner {
  type: 'Most-Valuable-Products';
}

export interface TopMerchantCarousel extends BaseBanner {
  type: 'Top-Merchant-Carousel';
}

export type Banner =
  | CarouselBanner
  | SingleImageBanner
  | SectionBanner
  | MerchantCarouselBanner
  | PromotionCarouselBanner
  | PromotionListBanner
  | SelectedMerchantsBanner
  | HorizontalMediumCarouselBanner
  | GridImageBanner
  | PartialViewBanner
  | VoucherCarousel
  | ThirdPartyCarousel
  | MostVisitedPosts
  | TimerBanner
  | NewestMerchantInstagram
  | MallCarousel
  | PostCarouselBanner
  | RecentlyViewed
  | MostValuableProducts
  | TopMerchantCarousel;
