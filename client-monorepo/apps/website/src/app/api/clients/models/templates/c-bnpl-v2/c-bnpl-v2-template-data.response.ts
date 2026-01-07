import { CBnplTypesTemplateData } from './c-bnpl-types-template-data';
import { CBnplVoucherTemplateData } from './c-bnpl-voucher-data';
import { CBnplPromotionBannerData } from './c-bnpl-promotion-banner-data';
import { ApiFile } from '../../common/api-file';
import { ButtonCta } from '../../../../../ui/models/button-cta';
import { STORE_CATEGORIES } from '../../../../digipay/models/merchants/store-categories';
import { FaqDefinition } from '../services/faq';
import { SeoContent } from '../../../../../ui/ui-components/ui-seo/seo-content';

export interface CBnplV2TemplateDataResponse {
  cBnplIntro: CBnplIntro;
  valueProposition: CBnplValueProposition;
  cBnplTypes: CBnplTypesTemplateData[];
  vouchers: CBnplVoucherTemplateData[];
  promotionBanner: CBnplPromotionBannerData;
  appPromotion: AppPromotion;
  bnplUsageTutorial: BnplUsageTutorial;
  cBnplStores: CBnplStores;
  sectionSeoContent: SeoContent;
  faq: FaqDefinition;
}

export interface CBnplIntro {
  title: string;
  subtitle: string;
  desc1: string;
  desc2: string;
  bnplIcon: ApiFile;
  firstCta: ButtonCta;
  secondCta: ButtonCta;
  video: ApiFile;
  requestBnplFormId: string;
}

export interface CBnplValueProposition {
  values: Array<{
    icon: ApiFile;
    title: string;
  }>;
}

export interface AppPromotion {
  title: string;
  subtitle: string;
  firstCta: ButtonCta;
  secondCta: ButtonCta;
  artwork: ApiFile;
}

export interface BnplUsageTutorial {
  title: string;
  steps: Array<{
    stepPicture: ApiFile;
    stepTitle: ApiFile;
  }>;
}

export interface CBnplStores {
  title: string;
  storeCategories: Array<{
    category: STORE_CATEGORIES;
  }>;
}
