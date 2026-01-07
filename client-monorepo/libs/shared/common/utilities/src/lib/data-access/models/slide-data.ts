import { SlideSimpleImageExtractedDataModel } from './slide-types/slide-simple-image-extracted-data.model';
import { SlideSectionBannerExtractedDataModel } from './slide-types/slide-section-banner-extracted-data.model';
import { SlideMallCarouselExtractedData } from './slide-types/slide-mall-carousel-extracted-data.model';
import { SlideTopMerchantExtractedData } from './slide-types/slide-top-merchant-extracted-data.model';

export type SlideData =
  SlideSimpleImageExtractedDataModel
  | SlideSectionBannerExtractedDataModel
  | SlideMallCarouselExtractedData
  | SlideTopMerchantExtractedData;

