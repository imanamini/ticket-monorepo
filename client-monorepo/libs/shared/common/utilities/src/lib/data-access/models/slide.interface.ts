import { SlideType } from './slide-type';
import { Action } from '@client-monorepo/common/action-handler';
import { SlideData } from './slide-data';
import { SlideSimpleImageExtractedDataModel } from './slide-types/slide-simple-image-extracted-data.model';
import { SlideSectionBannerExtractedDataModel } from './slide-types/slide-section-banner-extracted-data.model';
import { SlideMallCarouselExtractedData } from './slide-types/slide-mall-carousel-extracted-data.model';
import { SlideTopMerchantExtractedData } from './slide-types/slide-top-merchant-extracted-data.model';

export type Slide = SimpleImageSlide | SectionBannerSlide | MallCarouselSlide | TopMerchantSlide;

export interface BaseSlide {
  uuid: string;
  geoRestricted?: boolean;
  slideType: SlideType;
  order: number;
  event: string;
  action: string; // JSON
  data: string; // JSON
  extractedAction?: Action;
  extractedData?: SlideData;
  payload: { [key: string]: any };
  startTime?: number;
  endTime?: number;
}

export interface SimpleImageSlide extends BaseSlide {
  extractedData: SlideSimpleImageExtractedDataModel;
  extractedAction: Action;
}

export interface MallCarouselSlide extends BaseSlide {
  extractedData: SlideMallCarouselExtractedData;
  extractedAction: Action;
}

export interface TopMerchantSlide extends BaseSlide {
  extractedData: SlideTopMerchantExtractedData;
  extractedAction: Action;
}

export interface SectionBannerSlide extends BaseSlide {
  extractedData: SlideSectionBannerExtractedDataModel;
  extractedAction: Action;
}
