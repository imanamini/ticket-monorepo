import { ConfigSectionBannerExtractedData } from './config-types/config-section-banner-extracted-data.model';
import { PromotionCarouselConfig } from './config-types/promotion-carousel-config.interface';
import { MerchantCarouselConfig } from './config-types/merchant-carousel-config.interface';

export type ConfigData = PromotionCarouselConfig | MerchantCarouselConfig | ConfigSectionBannerExtractedData;
