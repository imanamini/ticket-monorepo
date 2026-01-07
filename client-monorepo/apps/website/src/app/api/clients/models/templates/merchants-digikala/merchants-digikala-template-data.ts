import { ApiFile } from '../../common/api-file';
import { ButtonCta } from '../../../../../ui/models/button-cta';
import { CreditMerchants, DigikalaProducts } from '../credit-v3/credit-config.response';
import { FaqDefinition } from '../services/faq';
import { SeoContent } from '../../../../../ui/ui-components/ui-seo/seo-content';

export interface MerchantsDigikalaTemplateData {
  sectionSlidingIntroduction: SlidingIntroduction;
  sectionCreditRoadmap: MerchantsDigikalaCreditRoadmap;
  sectionCreditPromotion: MerchantsDigikalaCreditPromotion;
  sectionDigikalaProducts: DigikalaProducts;
  sectionStores: CreditMerchants;
  sectionSeoContent: SeoContent;
  faq: FaqDefinition;
}

export interface SlidingIntroduction {
  mainIcon: ApiFile;
  title: string;
  desktopBanner: ApiFile;
  tabletBanner: ApiFile;
  mobileBanner: ApiFile;
  sliderItems: Array<{
    sliderText: string;
    artwork: ApiFile;
  }>;
}

export interface MerchantsDigikalaCreditRoadmap {
  title: string;
  installmentPurchaseSteps: Array<{
    icon: ApiFile;
    title: string;
    subtitle: string;
  }>;
  firstCta: ButtonCta;
}

export interface MerchantsDigikalaCreditPromotion {
  techBestSellers: CreditPromotionTechBestSellers;
  renewHomeWithInstallments: RenewHomeWithInstallments;
  gainCreditOffer: GainCreditOffer;
  smartestInstallments: SmartestInstallments;
}

export interface CreditPromotionTechBestSellers {
  title: string;
  technologyCategories: Array<{
    title: string;
    subtitle: string;
    firstCta: ButtonCta;
    secondCta: ButtonCta;
    banner: ApiFile;
    themeColor: string;
  }>;
}

export interface RenewHomeWithInstallments {
  title: string;
  categories: Array<{
    title: string;
    subtitle: string;
    firstCta: ButtonCta;
    secondCta: ButtonCta;
    banner: ApiFile;
    themeColor: string;
  }>;
}

export interface GainCreditOffer {
  icon: ApiFile;
  title: string;
  subtitle: string;
  firstCta: ButtonCta;
}

export interface SmartestInstallments {
  title: string;
  categories: Array<{
    title: string;
    subtitle: string;
    firstCta: ButtonCta;
    secondCta: ButtonCta;
    banner: ApiFile;
    bannerBackgroundColor: string;
    contentBackgroundColor: string;
  }>;
}
